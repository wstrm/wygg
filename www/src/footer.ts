import { IComponent } from "./component";
import { html } from "./template";

const upperCase = (str: string): string => {
  return str.toUpperCase();
};

/** An IContactInfo holds contact fields for the footer.  */
export interface IContactInfo {
  /** Title of the web page, e.g. "LTU Mesh". */
  title: string;
  /** Contact email address, e.g. "hello@ltu.mesh". */
  email: string;
  /** Contact street address, e.g. "Docentvägen 42, LGH 1337". */
  street: string;
  /** Contact city, e.g. "Luleå". */
  city: string;
  /** Contact ZIP code, e.g. "977 99". */
  zip: string;
  /** Contact country, e.g. "Sweden". */
  country: string;
}

export class FooterComponent implements IComponent {
  constructor(info: IContactInfo, year: number) {
    this.info = info;
    this.year = year;
  }

  public init() {
    // No-op.
  }

  public view() {
    const info = this.info;
    const year = this.year;

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
  }
}
