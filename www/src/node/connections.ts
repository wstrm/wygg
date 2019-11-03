import { IComponent } from "../lib/component";
import { html } from "../lib/template";

export class ConnectionsComponent implements IComponent {
  public init(): void {
    // No-op.
  }

  public view(): string {
    return html`
      <p>
        Blah blah current connections.
      </p>
    `;
  }
}
