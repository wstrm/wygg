import { FooterComponent, IContactInfo } from "./footer";
import { HeaderComponent, IMenuItem } from "./header";
import { IComponent } from "./lib/component";
import { router } from "./lib/router";
import { html } from "./lib/template";
import { NodeComponent } from "./node";
import { NotFoundComponent } from "./notfound";
import { PeerComponent } from "./peers";
import logoURL from "./static/image/mesh-logo.svg";

const menuItem = (name: string, url: string): IMenuItem => {
  return { name, url: "!#/" + url };
};

const currentYear: number = new Date().getFullYear();

const contactInformation: IContactInfo = {
  city: "Luleå",
  country: "Sweden",
  email: "hello@ltu.mesh",
  street: "Docentvägen 20, LGH 1001",
  title: "LTU Mesh",
  zip: "977 52"
};

const headerComponent = new HeaderComponent(logoURL, [
    menuItem("Node", ""),
    menuItem("Peers", "peers"),
    menuItem("Map", "map")
  ]);

const footerComponent = new FooterComponent(contactInformation, currentYear);

document.body.innerHTML =
  headerComponent.view() +
  html`<main></main>` +
  footerComponent.view();

headerComponent.init();
footerComponent.init();

router("main",
  {
    "/": new NodeComponent("william"),
    "/peers": new PeerComponent(),
  },
  new NotFoundComponent()
);
