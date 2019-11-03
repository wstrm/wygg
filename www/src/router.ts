import { IComponent } from "./component";

interface IRoutes {
  [path: string]: IComponent
}

export const router = (mountTag: string, routes: IRoutes, notFoundRoute: IComponent) => {

  const update = () => {
    const el = el || document.getElementsByTagName(mountTag)[0];
    const url = location.hash.slice(1) || "/";
    const component = routes[url] || notFoundRoute;

    if (el) {
      el.innerHTML = component.view();
      component.init()
    }
  }

  window.addEventListener("hashchange", update));
  window.addEventListener("load", update));
}
