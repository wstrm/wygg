import { footerView, IContactInfo } from "./footer";
import { headerView, IMenuItem } from "./header";
import { nodeView } from "./node";
import { peerView } from "./peers";
import { router } from "./router";
import logoURL from "./static/image/mesh-logo.svg";
import { html } from "./template";

const menuItem = (name: string, url: string): IMenuItem => {
  return { name, url: "!#/" + url };
};

const currentYear: number = new Date().getFullYear();

/* MODEL */

const contactInformation: IContactInfo = {
  city: "Luleå",
  country: "Sweden",
  email: "hello@ltu.mesh",
  street: "Docentvägen 20, LGH 1001",
  title: "LTU Mesh",
  zip: "977 52"
};

/* VIEW */

const contentView = (): string => {
  return html`<main></main>`;
}

const notFoundView = (): string => {
  return html`
    <ol class="breadcrumb">
      <li>404</li>
    </ol>
    <section>
      <h1>Not Found</h1>
      <p>
      Sorry, the requested page was not found.
      </p>
    <section>
  `
}

/* INIT */

document.body.innerHTML =
  headerView(logoURL, [
    menuItem("Node", ""),
    menuItem("Peers", "peers"),
    menuItem("Map", "map")
  ]) +
  contentView() +
  footerView(contactInformation, currentYear);

/* ROUTER */

router(
  {
    "/": nodeView(),
    "/peers": peerView()
  },
  notFoundView());
