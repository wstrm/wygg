import { IComponent } from "./component";
import { html } from "./template";

export class NodeComponent implements IComponent {
  constructor(name: string) {
    this.name = name;
  }

  public init() {
    const button = document.getElementById("click_me");
    button.onclick = () => console.log("hello");
  }

  public view() {
    return html`
      <ol class="breadcrumb">
        <li>Node</li>
      </ol>

      <!-- Section containing some general information about LTU Mesh, again,
        using a section-tag so the website is more semantic -->
      <section>
        <h1>Node Overview</h1>
        <p>
        Blah blah from here you can control your node.
        </p>
        <h3>Current Connections</h3>
        <p>
        Blah blah current connections.
        </p>
        <button id="click_me">Click me</button>
        Hello ${this.name}
      </section>
    `;
  }
}
