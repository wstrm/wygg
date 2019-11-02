import { html } from "./template";

/* MODEL */

/** An IMenuItem is a clickable item to be displayed in a menu. */
export interface IMenuItem {
  /** A title/name for the item. */
  name: string;
  /** An URL to use when clicking the item. */
  url: string;
}

/* VIEW */

export const headerView = (logoURL: string, menus: IMenuItem[]): string => {
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
};
