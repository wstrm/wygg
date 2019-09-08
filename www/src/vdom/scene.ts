import { diff } from "./diff";
import { applyPatches } from "./patches";
import { render } from "./render";
import { Html, NodeCache } from "./types";

export type Scheduler = (view: Html) => void;

export function scene(view: Html, root: HTMLElement): void {
  const cache: NodeCache = new NodeCache();
  root.appendChild(render(view, cache));

  let lastView = view;
  return (newView: Html): void => {
    const patches = diff(lastView, newView, cache);
    applyPatches(patches, cache);
    lastView = newView;
  };
}
