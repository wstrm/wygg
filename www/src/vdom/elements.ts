import { Html, IAttributes, INode, IText, NodeType } from "./types";

export const text = (val: string): IText => ({
  nodeType: NodeType.TEXT,
  value: val
});

export const node = (
  tagName: string,
  attributes: IAttributes = {},
  children: Html[] = []
): INode => ({
  attributes,
  children: children.map(
    (next: Html | string): Html => {
      if (typeof next === "string") {
        return text(next);
      } else {
        return next;
      }
    }
  )
  nodeType: NodeType.NODE,
  tagName,
});

export const makeNode = (tagName: string) => (
  attributes: IAttributes = {},
  children: Html[]
): INode => node(tagName, attributes, children);

export const div = makeNode("div");
export const h1 = makeNode("h1");
export const ul = makeNode("ul");
export const li = makeNode("li");
