export const enum NodeType {
  TEXT,
  NODE
}

export interface IAttributes {
  [name: string]: string;
}

export interface INode {
  nodeType: NodeType.NODE;
  tagName: string;
  attributes: IAtttributes;
  children: INode[];
}

export interface IText {
  nodeType: NodeType.TEXT;
  value: string;
}

export type Html = INode | IText;
