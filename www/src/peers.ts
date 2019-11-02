import { html } from "./template";

/* MODEL */

/* VIEW */
export const peerView = (): string => {
  return html`
    <ol class="breadcrumb">
      <li>Peers</li>
    </ol>

    <!-- Section containing some general information about LTU Mesh, again,
      using a section-tag so the website is more semantic -->
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
};
