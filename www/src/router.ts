import { IComponent } from "./component";

type UpdateFn = () => void;

interface IRoutes {
  [path: string]: IComponent
}

export const path = () => {
    return location.hash.slice(1) || "/";
}

export const listen = (update: UpdateFn) {
  window.addEventListener("hashchange", update));
  window.addEventListener("load", update));
}

export const router = (mountTag: string, routes: IRoutes, notFoundRoute: IComponent) => {

  const update = () => {
    const el = el || document.getElementsByTagName(mountTag)[0];
    const url = path();
    const component = routes[url] || notFoundRoute;

    if (el) {
      el.innerHTML = component.view();
      component.init()
    }
  }

  listen(update);
}
