import { IAttributes } from "./types";

function isEventCallback(callback: any): callback is EventCallback {
  return typeof callback === "function" && callback.length === 1;
}

export function applyAttributes(
  element: HTMLElement,
  attributes: IAttributes
): void {
  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      const value: string | EventCallback | undefined = attributes[key];
      if (value === undefined) {
        element.removeAttribute(key);
      } else if (isEventCallback(value)) {
        element.addEventListener(key, value);
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
