import { Component } from "../lib/component";
import { html } from "../lib/template";

export class PeerComponent implements Component {
  public init(): void {
    // No-op.
  }

  public view(): string {
    return html`
      <ol class="breadcrumb">
        <li>Peers</li>
      </ol>
      <section>
        <h1>Peer Overview</h1>
        <p>
          Blah blah from here you can control your peers.
        </p>
        <h3>Current Connections</h3>
        <p>
          Blah blah current connections.
        </p>
      </section>
    `;
  }
}
