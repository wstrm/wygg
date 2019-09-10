import { html } from "./template.ts";

/* MODEL */

interface IMenuItem {
  name: string;
  url: string;
}

interface IContactInfo {
  title: string;
  email: string;
  street: string;
  city: string;
  zip: number;
  country: string;
}

const menuItem = (name: string, url: string): IMenuItem => {
  return { name, url };
};

const upperCase = (str: string): string => {
  return str.toUpperCase();
};

const currentYear: number = new Date().getFullYear();

const contactInformation: IContactInfo = {
  title: "LTU Mesh",
  email: "hello@ltu.mesh",
  street: "Docentvägen 20, LGH 1001",
  city: "Luleå",
  country: "Sweden",
  zip: "977 52"
};

/* VIEW */

const headerView = (menus: IMenuItem[]): string => {
  return html`
    <header>
      <!-- nav holds the top navigation bar -->
      <nav>
        <!-- Logotype -->
        <a href="/">
          <img src="img/mesh-logo.svg" alt="LTU Mesh logotype" />
        </a>

        <!-- Hamburger menu that is only displayed on mobile devices -->
        <input type="checkbox" /> <span></span> <span></span> <span></span>

        <!--
          Each item in the navigation bar is contained in a unordered list
        -->
        <ul>
          ${
            menus.map(
              menu =>
                html`
                  <li><a href="${menu.url}">${menu.name}</a></li>
                `
            )
          }
        </ul>
      </nav>
    </header>
  `;
};

const footerView = (info: IContactInfo, year: number): string => {
  return html`
    <!--
      Footer is contained in a footer-tag. Each row is represented by a
      div-tag (as of now just one row) and each column is represented by a
      section-tag
    -->
    <footer>
      <div>
        <section>
          <h3>Contact</h3>
          <!-- Address and e-mail to the LTU Mesh HQ -->
          <address>
            <strong>E-mail</strong>:
            <a href="mailto:${info.email}">${info.email}</a><br />
            <strong>Visit us at</strong>:<br />
            ${info.street}<br />
            ${upperCase(info.city)} ${info.zip}<br />
            ${info.country}
          </address>
        </section>
        <section>
          <h3>Legal</h3>
          <!--
            Using details-tag so only the most important information is
            displayed per default
          -->
          <details>
            <summary> Copyright &copy; ${year} ${info.title} </summary>
            <ul>
              <li>All Rights Reserved.</li>
              <li>
                All content and graphics on this web site are the property of
                ${info.title}.
              </li>
            </ul>
          </details>
        </section>
      </div>
    </footer>
  `;
};

document.body.innerHTML =
  headerView(
    [
      menuItem("Node", "/"),
      menuItem("Peers", "/peers"),
      menuItem("Map", "/map")
    ]
  ) + footerView(contactInformation, currentYear);
