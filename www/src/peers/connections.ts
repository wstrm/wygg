import { DynamicComponent } from "../lib/component";
import { html } from "../lib/template";
import { Network } from "../lib/network";

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
            <th>Uptime</th>
            <th>Endpoint</th>
            <th>In/Out</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${peers.map(
            ([address, info]) =>
              html`
                <tr>
                  <td>${address}</td>
                  <td>${info.uptime}</td>
                  <td>${info.endpoint}</td>
                  <td>${info.bytes_recvd}/${info.bytes_sent}</td>
                  <td><a href="/#/peer/${info.box_pub_key}">More info</a></td>
                </tr>
              `
          )}
        </tbody>
      </table>
    `;
  }
}
