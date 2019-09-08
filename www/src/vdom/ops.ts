import { IAttributes } from "./types";

export function applyAttributes(
  element: HTMLElement,
  attributes: IAttributes
): void {
  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      const value: string | undefined = attributes[key];
      if (value === undefined) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, value);
      }
    }
  }
}

export function removeElement(node: Node): void {
  if (node.parentNode !== null) {
    node.parentNode.removeChild(node);
  }
}

export function replaceElement(oldNode: Node, newNode: Node) {
  if (oldNode.parentNode !== null) {
    oldNode.parentNode.replaceChild(newNode, oldNode);
  }
}
