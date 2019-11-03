import { Component } from "../lib/component";
import { html } from "../lib/template";

export class OverviewComponent implements Component {
  public init(): void {
    // No-op.
  }

  public view(): string {
    return html`
      <p>
        Blah blah from here you can control your node.
      </p>
    `;
  }
}
