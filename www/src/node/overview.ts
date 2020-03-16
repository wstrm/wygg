import { DynamicComponent } from "../lib/component";
import { html } from "../lib/template";
import { Network } from "../lib/network";

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
    console.log(local);

    return html`
      ${local.map(
        ([address, info]) =>
        html`
          <ul>
            <li><strong>Address:</strong> ${address}</li>
            <li><strong>Public Key:</strong> ${info.box_pub_key}</li>
            <li><strong>Build Name:</strong> ${info.build_name}</li>
            <li><strong>Build Version:</strong> ${info.build_version}</li>
            <li><strong>Coordinates:</strong> ${info.coords}</li>
            <li><strong>Subnet:</strong> ${info.subnet}</li>
          </ul>
          `
      )}
    `;
  }
}
