import { Component } from "./lib/component";
import { html } from "./lib/template";

export class NotFoundComponent implements Component {
  public init(): void {
    // No-op.
  }

  public view(): void {
    return html`
      <ol class="breadcrumb">
        <li>404</li>
      </ol>
      <section>
        <h1>Not Found</h1>
        <p>
          Sorry, the requested page was not found.
        </p>
        <section></section>
      </section>
    `;
  }
}
