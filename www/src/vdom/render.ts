import { Html, NodeType } from "./types";

function createText(node: IText): Text {
  return document.createTextNode(node.value);
}

function createElement(node: INode, attributes: IAttributes): HTMLElement {
  const element: HTMLElement = document.createElement(
    node.tagName
  ) as HTMLElement;

  applyAttributes(element, attributes);

  for (const child of node.children) {
    element.appendChild(render(child));
  }

  return element;
}

function applyAttributes(element: HTMLElement, attributes: IAttributes): void {
  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      element.setAttribute(key, attributes[key]);
    }
  }
}

export function render(node: Html): Node {
  switch (node.nodeType) {
    case NodeType.NODE:
      return createElement(node);
    case NodeType.TEXT:
      return createText(node);
    default:
      throw new Error(`Non-exhaustive match for ${node as never}`);
  }
}
