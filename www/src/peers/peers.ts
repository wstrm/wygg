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
        <h1>Peer Overview</h1>
        <p>
          Blah blah from here you can control your peers.
        </p>
        <h3>Current Connections</h3>
        ${connectionsComponent.view()}
      </section>
    `;
  }
}
