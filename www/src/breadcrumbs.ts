import { Component } from "./lib/component";
import { html } from "./lib/template";

interface Breadcrumb {
  name: string;
  url: string;
}

export type BreadcrumbTrail = Breadcrumb[];

export class BreadcrumbsComponent implements Component {
  constructor(trail: Breadcrumb[], name: string) {
    this.trail = trail;
    this.name = name;
  }

  public init(): void {
    // No-op.
  }

  public view(): string {
    const trail = this.trail;
    const name = this.name;

    return html`
      <ol class="breadcrumb">
        ${trail.map(
          crumb =>
            html`
              <li><a href="${crumb.url}">${crumb.name}</a></li>
            `
        )}
        <li>${name}</li>
      </ol>
    `;
  }
}
