import { BreadcrumbsComponent, BreadcrumbTrail } from "../breadcrumbs";
import { Component } from "../lib/component";
import { html } from "../lib/template";
import { ConnectionsComponent } from "./connections";
import { OverviewComponent } from "./overview";

export class NodeComponent implements Component {
  constructor(trail: BreadcrumbTrail) {
    this.breadcrumbsComponent = new BreadcrumbsComponent(trail, "Node");
    this.overviewComponent = new OverviewComponent();
    this.connectionsComponent = new ConnectionsComponent();
  }

  public init(): void {
    this.breadcrumbsComponent.init();
    this.overviewComponent.init();
    this.connectionsComponent.init();
  }

  public view(): string {
    const breadcrumbsComponent = this.breadcrumbsComponent;
    const overviewComponent = this.overviewComponent;
    const connectionsComponent = this.connectionsComponent;

    return html`
      ${breadcrumbsComponent.view()}
      <section>
        <h1>Node Overview</h1>
        ${overviewComponent.view()}
        <h3>Current Connections</h3>
        ${connectionsComponent.view()}
      </section>
    `;
  }
}
