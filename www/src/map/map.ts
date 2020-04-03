import { Component } from "../lib/component";
import { html } from "../lib/template";
import { Network } from "../lib/network";
import * as d3 from "d3";

enum PeerState {
  Local = 1,
  Active,
  Unknown,
}

function stringifyCoords(coords: number[]) {
  return "[" + coords.join(" ") + "]";
}

function shortAddress(address: string) {
  return address ? address.split(":").slice(-1)[0].padStart(4, "0") : "";
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  address: string;
  publicKey: string;
  state: PeerState;
}

interface GraphRefLink {
  source: string;
  target: string;
}

interface GraphLink {
  source: GraphNode;
  target: GraphNode;
}

class MapCanvas {
  private nodes: GraphNode[] = [];
  private links: GraphRefLink[] = [];

  constructor(dht: DHT) {
    dht.peers.forEach((peer) => {
      this.nodes.push({
        id: stringifyCoords(peer.coords),
        address: peer.address || "",
        publicKey: peer.publicKey || "",
        state: peer.state,
      });

      if (peer.parent) {
        this.links.push({
          source: stringifyCoords(peer.coords),
          target: stringifyCoords(peer.parent),
        });
      }
    });
  }

  private color(d: GraphNode) {
    switch (d.state) {
      case PeerState.Local:
        return "#3d518c";
      case PeerState.Active:
        return "#1a936f";
      default:
        return "#aaaaaa";
    }
  }

  private drag(simulation: d3.Simulation<GraphNode, GraphLink>): any {
    const start = (d: any) => {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    const drag = (d: any) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const end = (d: any) => {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }

      d.fx = null;
      d.fy = null;
    };

    return d3.drag().on("start", start).on("drag", drag).on("end", end);
  }

  public render(id: string): void {
    const nodes = this.nodes;
    const links = this.links;

    const width = window.innerWidth;
    const height = window.innerWidth;

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d: any) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-200)) // Minus => repulsion.
      .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3
      .select(id)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMinYMin");

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 5.0);

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", this.color)
      .call(this.drag(simulation));

    node.append("title").text((d) => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
    });
  }
}

class Peer {
  public coords: number[];
  public parent: number[] | null;
  public publicKey: string;
  public lastSeen: string;

  constructor(
    public address: string | null,
    info: any,
    public state: PeerState
  ) {
    this.coords = info["coords"]
      .replace(/[^0-9 ]/g, "")
      .split(" ")
      .map(Number);

    this.publicKey = info["box_pub_key"];
    this.lastSeen = info["last_seen"];
    this.parent = this.coords.length > 1 ? this.coords.slice(0, -1) : null;
  }
}

class DHT {
  public peers: Peer[] = [];

  constructor(peers: Peer[]) {
    const known = new Set();
    const parents: number[][] = [];

    this.peers = [];

    peers.forEach((peer) => {
      known.add(stringifyCoords(peer.coords));

      if (peer.parent) {
        parents.push([...peer.parent]);
      }

      this.peers.push(peer);
    });

    parents.forEach((coords) => {
      while (coords.length > 0) {
        const parentCoords = stringifyCoords(coords);

        if (!known.has(parentCoords)) {
          known.add(parentCoords);
          this.peers.push(
            new Peer(null, { coords: parentCoords }, PeerState.Unknown)
          );
        }

        coords.pop();
      }
    });
  }
}

export class MapComponent implements Component {
  public init(): void {
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
      const canvas = new MapCanvas(dht);
      canvas.render("#map");
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
