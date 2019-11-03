import { Component } from "./lib/component";
import { basename, listen, path } from "./lib/router";
import { html } from "./lib/template";

/** An HeaderItem is a clickable item to be displayed in a menu. */
export interface HeaderItem {
  /** A title/name for the item. */
  name: string;
  /** An URL to use when clicking the item. */
  url: string;
}

export class HeaderComponent implements Component {
  constructor(
    private logoURL: string,
    private home: HeaderItem,
    private menus: HeaderItem[]
  ) {}

  public init(): void {
    listen(this.update);
  }

  public view(): string {
    const logoURL = this.logoURL;
    const home = this.home;
    const menus = this.menus;

    return html`
      <header>
        <!-- nav holds the top navigation bar -->
        <nav>
          <!-- Logotype -->
          <a href="${home.url}" title="${home.name}">
            <img src="${logoURL}" alt="LTU Mesh logotype" />
          </a>

          <!-- Hamburger menu that is only displayed on mobile devices -->
          <input type="checkbox" /> <span></span> <span></span> <span></span>

          <!--
            Each item in the navigation bar is contained in a unordered list
          -->
          <ul id="navigation-items">
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

  private update(): void {
    const items = document.getElementById("navigation-items");

    Array.from(items.children).forEach((link: HTMLLIElement) => {
      const base = basename(link.firstChild);

      if (base === path()) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
}
