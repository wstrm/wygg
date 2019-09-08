import { applyAttributes } from "./ops";
import { Html, NodeCache, NodeType } from "./types";

function createText(node: IText): Text {
  return document.createTextNode(node.value);
}

function createElement(node: INode, cache: NodeCache): HTMLElement {
  const element: HTMLElement = document.createElement(
    node.tagName
  ) as HTMLElement;

  applyAttributes(element, node.attributes);

  for (const child of node.children) {
    element.appendChild(render(child, cache));
  }

  return element;
}

export function render(node: Html, cache: NodeCache): Node {
  switch (node.nodeType) {
    case NodeType.NODE:
      const element: HTMLElement = createElement(node, cache);
      cache.set(node, element);
      return element;
    case NodeType.TEXT:
      const text: Text = createText(node);
      cache.set(node, text);
      return text;
    default:
      throw new Error(`Non-exhaustive match for ${node as never}`);
  }
}
