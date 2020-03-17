import { BreadcrumbsComponent, BreadcrumbTrail } from "../breadcrumbs";
import { DynamicComponent } from "../lib/component";
import { ConnectionsComponent } from "./connections";
import { html } from "../lib/template";

export class PeerComponent extends DynamicComponent {
  constructor(trail: BreadcrumbTrail) {
    super();

    this.breadcrumbsComponent = new BreadcrumbsComponent(trail, "Peer");
    this.connectionsComponent = new ConnectionsComponent();
  }

  public init(): void {
    this.breadcrumbsComponent.init();
    this.connectionsComponent.init();

    this.connectionsComponent.listen(() => {
      this.render();
    });
  }

  public view(): string {
    const breadcrumbsComponent = this.breadcrumbsComponent;
    const connectionsComponent = this.connectionsComponent;

    return html`
      ${breadcrumbsComponent.view()}
      <section>
        <h1>Peers</h1>
        <p>
        Peers are nodes that are connected with this node. The peers are able to
        route the data from and through this node to others that are part of the
        same network.
        </p>
      <section>
      </section>
        <h3>Connections</h3>
        ${connectionsComponent.view()}
      </section>
    `;
  }
}
