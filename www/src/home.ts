import { BreadcrumbsComponent } from "./breadcrumbs";
import { Component } from "./lib/component";
import { html } from "./lib/template";

export class HomeComponent implements Component {
  constructor() {
    this.breadcrumbsComponent = new BreadcrumbsComponent([], "Home");
  }

  public init(): void {
    this.breadcrumbsComponent.init();
  }

  public view(): string {
    const breadcrumbsComponent = this.breadcrumbsComponent;

    return html`
      ${breadcrumbsComponent.view()}
      <section>
        <h1>Hello!</h1>
      </section>
    `;
  }
}
