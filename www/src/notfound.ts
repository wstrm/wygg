import { IComponent } from "./component";
import { html } from "./template";

export class NotFoundComponent implements IComponent {
  public init() {
    // No-op.
  };

  public view() {
    return html`
      <ol class="breadcrumb">
        <li>404</li>
      </ol>
      <section>
        <h1>Not Found</h1>
        <p>
        Sorry, the requested page was not found.
        </p>
      <section>
    `;
  };
}
