import { Component } from "../component";

type UpdateFn = () => void;

interface Route {
  title: string;
  component: Component;
}

interface Routes {
  [path: string]: Route;
}

export const basename = (loc: Location): string | undefined => {
  if (loc && (loc.hash || loc.pathname)) {
    // Normalize `/#/<path>` into `/<path`.
    return loc.hash.slice(1) || loc.pathname;
  }

  return undefined;
};

export const path = (): string => {
  return basename(location) || "/";
};

export const listen = (update: UpdateFn): void => {
  window.addEventListener("hashchange", update);
  window.addEventListener("load", update);
};

export const router = (
  mountTag: string,
  mainTitle: string,
  routes: Routes,
  notFoundRoute: Route
): void => {
  const update = (): void => {
    const el = null || document.getElementsByTagName(mountTag)[0];
    const url = path();
    const route = routes[url] || notFoundRoute;

    const component = route.component;
    const title = route.title + " · " + mainTitle;

    if (el) {
      el.innerHTML = component.view();
      component.init();
      document.title = title;
    }
  };

  listen(update);
};
