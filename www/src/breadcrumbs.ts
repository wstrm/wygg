import { Component } from "./lib/component";
import { html } from "./lib/template";

interface Breadcrumb {
  name: string;
  url: string;
}

export type BreadcrumbTrail = Breadcrumb[];

export class BreadcrumbsComponent implements Component {
  constructor(private trail: Breadcrumb[], private name: string) {}

  public init(): void {
    // No-op.
  }

  public view(): string {
    const trail = this.trail;
    const name = this.name;

    // Create breadcrumbs from the trail.
    const crumbs = trail.map(
      crumb =>
        html`
          <li><a href="${crumb.url}">${crumb.name}</a></li>
        `
    );

    // Append the current location as a crumb without any link.
    crumbs.push(
      html`
        <li>${name}</li>
      `
    );

    return html`
      <ol class="breadcrumb">
        ${crumbs}
      </ol>
    `;
  }
}
