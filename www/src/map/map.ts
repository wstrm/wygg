import { BreadcrumbsComponent, BreadcrumbTrail } from "../breadcrumbs";
import { Component } from "../lib/component";
import { html } from "../lib/template";

export class MapComponent implements Component {
  constructor(trail: BreadcrumbTrail) {
    this.breadcrumbsComponent = new BreadcrumbsComponent(trail, "Map");
  }

  public init(): void {
    this.breadcrumbsComponent.init();
  }

  public view(): string {
    const breadcrumbsComponent = this.breadcrumbsComponent;

    return html`
      ${breadcrumbsComponent.view()}
      <section>
        <h1>Map</h1>
      </section>
    `;
  }
}
