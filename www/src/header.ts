import { IComponent } from "./component";
import { html } from "./template";

/** An IMenuItem is a clickable item to be displayed in a menu. */
export interface IMenuItem {
  /** A title/name for the item. */
  name: string;
  /** An URL to use when clicking the item. */
  url: string;
}

export class HeaderComponent implements IComponent {
  constructor(logoURL: string, menus: IMenuItem[]) {
    this.logoURL = logoURL;
    this.menus = menus;
  }

  public init() {
    // No-op.
  }

  public view() {
    const logoURL = this.logoURL;
    const menus = this.menus;

    return html`
      <header>
        <!-- nav holds the top navigation bar -->
        <nav>
          <!-- Logotype -->
          <a href="/">
            <img src="${ logoURL }" alt="LTU Mesh logotype" />
          </a>

          <!-- Hamburger menu that is only displayed on mobile devices -->
          <input type="checkbox" /> <span></span> <span></span> <span></span>

          <!--
            Each item in the navigation bar is contained in a unordered list
          -->
          <ul>
            ${menus.map(
              menu =>
                html`
                  <li><a href="${menu.url}">${menu.name}</a></li>
                `
            )}
          </ul>
        </nav>
      </header>
    `;
  }
}
