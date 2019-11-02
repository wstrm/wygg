interface IRoutes {
  [path: string]: string
};

export const router = (routes: IRoutes, notFoundView: string) => {

  const update = () => {
    const el = el || document.getElementsByTagName("main")[0];
    const url = location.hash.slice(1) || "/";
    const view = routes[url];

    if (el) {
      if (view) {
        el.innerHTML = view;
      } else {
        el.innerHTML = notFoundView;
      }
    }
  }

  window.addEventListener("hashchange", update));
  window.addEventListener("load", update));
}

