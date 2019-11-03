import { FooterComponent, ContactInfo } from "./footer";
import { HeaderComponent, HeaderItem } from "./header";
import { HomeComponent } from "./home";
import { router } from "./lib/router";
import { html } from "./lib/template";
import { NodeComponent } from "./node";
import { NotFoundComponent } from "./notfound";
import { PeerComponent } from "./peers";
import { MapComponent } from "./map";
import logoURL from "./static/image/mesh-logo.svg";

const headerItem = (name: string, url: string): HeaderItem => {
  return { name, url: "!#/" + url };
};

const currentYear: number = new Date().getFullYear();

const contactInformation: ContactInfo = {
  city: "Luleå",
  country: "Sweden",
  email: "hello@ltu.mesh",
  street: "Docentvägen 20, LGH 1001",
  title: "LTU Mesh",
  zip: "977 52"
};

const headerComponent = new HeaderComponent(logoURL, headerItem("Home", ""), [
  headerItem("Node", "node"),
  headerItem("Peers", "peers"),
  headerItem("Map", "map")
]);

const footerComponent = new FooterComponent(contactInformation, currentYear);

document.body.innerHTML =
  headerComponent.view() +
  html`
    <main></main>
  ` +
  footerComponent.view();

headerComponent.init();
footerComponent.init();

const homeTrail: BreadcrumbTrail = [
  {
    name: "Home",
    url: "/!#/"
  }
];

router(
  "main",
  {
    "/": new HomeComponent(),
    "/node": new NodeComponent(homeTrail),
    "/peers": new PeerComponent(homeTrail),
    "/map": new MapComponent(homeTrail)
  },

  new NotFoundComponent()
);
