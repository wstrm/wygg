import { DynamicComponent } from "../lib/component";
import { html } from "../lib/template";
import { Network } from "../lib/network";

function toMib(bytes: float): string {
  return (bytes / 1024 / 1024).toFixed(1);
}

function toInt(f: float): int {
  return Math.round(f);
}

export class ConnectionsComponent extends DynamicComponent {
  private peers = [];

  constructor() {
    super();
  }

  public init(): void {
    if (this.peers.length == 0) {
      Network.request("GET", ["peers"]).then(peers => {
        this.peers = Object.entries(peers);
        this.render();
      });
    }
  }

  public view(): string {
    const peers = this.peers;

    return html`
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Uptime (s)</th>
            <th>Endpoint</th>
            <th>In/Out (Mib)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${peers.map(
            ([address, info]) =>
              html`
                <tr>
                  <td>${address}</td>
                  <td>${toInt(info.uptime)}</td>
                  <td>${info.endpoint}</td>
                  <td>${toMib(info.bytes_recvd)}/${toMib(info.bytes_sent)}</td>
                  <td><a href="/#/peer/${info.box_pub_key}">More</a></td>
                </tr>
              `
          )}
        </tbody>
      </table>
    `;
  }
}
