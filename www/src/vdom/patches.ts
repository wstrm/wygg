import { applyAttributes, removeElement, replaceElement } from "./ops";
import { render } from "./render";
import { Patch, PatchType } from "./types";

function applyPatch(patch: Patch, cache: NodeCache): void {
  switch (patch.patchType) {
    case PatchType.PROPERTIES:
      applyAttributes(patch.domNode as HTMLElement, patch.attributes);
      return;
    case PatchType.TEXT:
      patch.domNode.textContent = patch.value;
      return;
    case PatchType.REMOVE:
      removeElement(patch.domNode);
      return;
    case PatchType.REPLACE:
      replaceElement(patch.domNode, render(patch.node, cache));
      return;
    case PatchType.APPEND:
      patch.domNode.appendChild(render(patch.node, cache));
      return;
  }
}

export function applyPatches(patches: Patch[], cache: NodeCache): void {
  for (const patch of patches) {
    applyPatch(patch, cache);
  }
}
