import { html } from "./template.ts";

interface IMenuItem {
  name: string;
  url: string;
}

const view = (menus: IMenuItem[]) => {
  return html`
    <nav>
      <a href="/">
        <img src=""img/mesh-logo.svg"" alt="LTU Mesh logotype" />
      </a>
      <ul>
        ${menus.map(
          menu =>
            html`
              <li>${menu.name} (${menu.url})</li>
            `
        )}
      </ul>
    </nav>
  `;
};

document.body.innerHTML = view([
  { name: "Hello", url: "/somewhere" },
  { name: "Good bye", url: "/dunno" }
]);
