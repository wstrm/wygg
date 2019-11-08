import { BreadcrumbsComponent, BreadcrumbTrail } from "../breadcrumbs";
import { Component } from "../lib/component";
import { html } from "../lib/template";
import { OverviewComponent } from "./overview";

export class NodeComponent implements Component {
  constructor(trail: BreadcrumbTrail) {
    this.breadcrumbsComponent = new BreadcrumbsComponent(trail, "Node");
    this.overviewComponent = new OverviewComponent();
  }

  public init(): void {
    this.breadcrumbsComponent.init();
    this.overviewComponent.init();
  }

  public view(): string {
    const breadcrumbsComponent = this.breadcrumbsComponent;
    const overviewComponent = this.overviewComponent;

    return html`
      ${breadcrumbsComponent.view()}
      <section>
        <h1>Node Overview</h1>
        ${overviewComponent.view()}
      </section>
    `;
  }
}
