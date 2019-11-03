import { BreadcrumbsComponent, BreadcrumbTrail } from "../breadcrumbs";
import { Component } from "../lib/component";
import { html } from "../lib/template";

export class PeerComponent implements Component {
  constructor(trail: BreadcrumbTrail) {
    this.breadcrumbsComponent = new BreadcrumbsComponent(trail, "Peer");
  }

  public init(): void {
    this.breadcrumbsComponent.init();
  }

  public view(): string {
    const breadcrumbsComponent = this.breadcrumbsComponent;

    return html`
      ${breadcrumbsComponent.view()}
      <section>
        <h1>Peer Overview</h1>
        <p>
          Blah blah from here you can control your peers.
        </p>
        <h3>Current Connections</h3>
        <p>
          Blah blah current connections.
        </p>
      </section>
    `;
  }
}
