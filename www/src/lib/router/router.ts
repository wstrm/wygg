import { Component } from "../component";

type UpdateFn = () => void;

interface Routes {
  [path: string]: Component;
}

export const basename = (loc: Location): string | undefined => {
  if (loc && (loc.hash || loc.pathname)) {
    // Normalize `/!#/<path>` into `/<path`.
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
  routes: Routes,
  notFoundRoute: Component
): void => {
  const update = (): void => {
    const el = null || document.getElementsByTagName(mountTag)[0];
    const url = path();
    const component = routes[url] || notFoundRoute;

    if (el) {
      el.innerHTML = component.view();
      component.init();
    }
  };

  listen(update);
};
