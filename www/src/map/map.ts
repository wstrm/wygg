import { Component } from "../lib/component";
import { html } from "../lib/template";
import { Network } from "../lib/network";
import * as d3 from "d3";

enum PeerState {
  Local = 1,
  Active,
  Unknown,
}

function stringifyCoords(coords) {
  return "[" + coords.join(" ") + "]";
}

function shortAddress(address) {
  return address ? address.split(":").slice(-1)[0].padStart(4, "0") : "";
}

class Peer {
  constructor(address, info, state) {
    this.coords = info["coords"]
      .replace(/[^0-9 ]/g, "")
      .split(" ")
      .map(Number);

    this.address = address;
    this.publicKey = info["box_pub_key"];
    this.lastSeen = info["last_seen"];
    this.state = state;
    this.parent = this.coords.length > 1 ? this.coords.slice(0, -1) : null;
  }
}

class DHT {
  constructor(peers) {
    const known = new Set();
    const parents = []

    this.peers = [];

    peers.forEach((peer) => {
      known.add(stringifyCoords(peer.coords));

      if peer.parent {
        parents.push([...peer.parent]);
      }

      this.peers.push(peer);
    });

    parents.forEach((coords) => {
      while coords.length > 0 {
        const parentCoords = stringifyCoords(coords)

        if !known.has(parentCoords) {
          known.add(parentCoords);
          this.peers.push(new Peer(null, { coords: parentCoords, }, PeerState.Unknown));
        }

        coords.pop();
      }
    });
  }
}

export class MapComponent implements Component {
  public init(): void {
    let graph = {
      nodes: [],
      links: [],
    }

    Promise.all([
      Network.request("GET", ["dht"]),
      Network.request("GET", ["local"]),
    ]).then(([_dht, _local]) => {

      _local = Object.entries(_local)[0];
      _dht = Object.entries(_dht);

      const local = new Peer(_local[0], _local[1], PeerState.Local);
      const peers = _dht.map(([address, info]) => {
        return new Peer(address, info, PeerState.Active);
      });
      const dht = new DHT([local].concat(peers));

      dht.peers.forEach((peer) => {
        graph.nodes.push({
          id: stringifyCoords(peer.coords),
          address: peer.address || "",
          publicKey: peer.publicKey || "",
          state: peer.state,
        });

        if peer.parent {
          graph.links.push({
            source: stringifyCoords(peer.coords),
            target: stringifyCoords(peer.parent),
          });
        }
      });

      const width = 800;
      const height = 600;
      const color = d3.scaleOrdinal(d3.schemeSet1);

      let label = {
        'nodes': [],
        'links': []
      };

      graph.nodes.forEach((d, i) => {
        label.nodes.push({node: d});
        label.nodes.push({node: d});
        label.links.push({
          source: i * 2,
          target: i * 2 + 1
        });
      });

      let labelLayout = d3.forceSimulation(label.nodes)
        .force("charge", d3.forceManyBody().strength(-50))
        .force("link", d3.forceLink(label.links).distance(0).strength(2));

      let graphLayout = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody().strength(-3000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3.forceLink(graph.links).id((d) => return d.id).distance(50).strength(1))
        .on("tick", ticked);

      let adjlist = [];

      graph.links.forEach(function(d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
      });

      function neigh(a, b) {
        return a == b || adjlist[a + "-" + b];
      }

      let svg = d3.select("#map")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
        .attr('preserveAspectRatio','xMinYMin');

      let container = svg.append("g");

      svg.call(
        d3.zoom()
        .scaleExtent([.1, 4])
        .on("zoom", function() { container.attr("transform", d3.event.transform); })
      );

      let link = container.append("g").attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke", "#aaa")
        .attr("stroke-width", "1px");

      let node = container.append("g").attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .attr("fill", function(d) {
          switch (d.state) {
            case PeerState.Local:
              return "#3d518c";
            case PeerState.Active:
              return "#1a936f";
            default:
              return "#aaa";
          }
        })

      node.on("mouseover", focus).on("mouseout", unfocus);

      node.call(
        d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

      let labelNode = container.append("g").attr("class", "labelNodes")
        .selectAll("text")
        .data(label.nodes)
        .enter()
        .append("text")
        .text((d, i) => return i % 2 == 0 ? "" : shortAddress(d.node.address))
        .style("fill", "#555")
        .style("font-family", "Arial")
        .style("font-size", 12)
        .style("pointer-events", "none");

      node.on("mouseover", focus).on("mouseout", unfocus);

      function ticked() {
        node.call(updateNode);
        link.call(updateLink);

        labelLayout.alphaTarget(0.3).restart();
        labelNode.each(function(d, i) {
          if(i % 2 == 0) {
            d.x = d.node.x;
            d.y = d.node.y;
          } else {
            const b = this.getBBox();

            const diffX = d.x - d.node.x;
            const diffY = d.y - d.node.y;

            const dist = Math.sqrt(diffX * diffX + diffY * diffY);

            const shiftY = 16;
            let shiftX = b.width * (diffX - dist) / (dist * 2);
            shiftX = Math.max(-b.width, Math.min(0, shiftX));

            this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
          }
        });

        labelNode.call(updateNode);
      }

      function fixna(x) {
        if (isFinite(x)) {
          return x;
        }
        return 0;
      }

      function focus(d) {
        var index = d3.select(d3.event.target).datum().index;
        node.style("opacity", (o) => {
          return neigh(index, o.index) ? 1 : 0.1;
        });
        labelNode.attr("display", (o) => {
          return neigh(index, o.node.index) ? "block": "none";
        });
        link.style("opacity", (o) => {
          return o.source.index == index || o.target.index == index ? 1 : 0.1;
        });
      }

      function unfocus() {
        labelNode.attr("display", "block");
        node.style("opacity", 1);
        link.style("opacity", 1);
      }

      function updateLink(link) {
        link.attr("x1", (d) => return fixna(d.source.x))
          .attr("y1", (d) => return fixna(d.source.y))
          .attr("x2", (d) => return fixna(d.target.x))
          .attr("y2", (d) => return fixna(d.target.y));
      }

      function updateNode(node) {
        node.attr("transform", (d) => {
          return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
        });
      }

      function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();

        if (!d3.event.active) {
          graphLayout.alphaTarget(0.3).restart();
        }

        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) {
          graphLayout.alphaTarget(0);
        }

        d.fx = null;
        d.fy = null;
      }
    });
  }

  public view(): string {
    return html`
      <section>
        <div id="map-container">
        <svg id="map"></svg>
        </div>
      </section>
    `;
  }
}
