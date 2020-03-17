import { DynamicComponent } from "../lib/component";
import { html } from "../lib/template";
import { Network } from "../lib/network";

function shortPublicKey(key: string): string {
  return key.slice(0, 15) + ".." + key.slice(-15);
}

export class OverviewComponent extends DynamicComponent {
  private local = [];

  constructor() {
    super();
  }

  public init(): void {
    if (this.local.length == 0) {
      Network.request("GET", ["local"]).then(local => {
        this.local = Object.entries(local);
        this.render();
      });
    }
  }

  public view(): string {
    const local = this.local;

    return html`
      <table class="overview">
        <tbody>
          ${local.map(
            ([address, info]) =>
              html`
                <tr>
                  <th>Address</th>
                  <td>${address}</td>
                </tr>
                <tr>
                  <th>Public Key</th>
                  <td>${shortPublicKey(info.box_pub_key)}</td>
                </tr>
                <tr>
                  <th>Build Name</th>
                  <td>${info.build_name}</td>
                </tr>
                <tr>
                  <th>Build Version</th>
                  <td>${info.build_version}</td>
                </tr>
                <tr>
                  <th>Coordinates</th>
                  <td>${info.coords}</td>
                </tr>
                <tr>
                  <th>Subnet</th>
                  <td>${info.subnet}</td>
                </tr>
              `
          )}
        </tbody>
      </table>
    `;
  }
}
