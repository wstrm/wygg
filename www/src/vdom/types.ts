export const enum NodeType {
  TEXT,
  NODE
}

export const enum PatchType {
  ADDED,
  REPLACE,
  REMOVED,
  PROPERTIES,
  TEXT
}

export type EventCallback = (event: Event) => void;

export interface IAttributes {
  [name: string]: string | EventCallback | undefined;
}

export interface IAppendPatch {
  patchType: PatchType.APPEND;
  node: Html;
  domNode: Node;
}

export interface IReplacePatch {
  patchType: PatchType.REPLACE;
  node: Html;
  domNode: Node;
}

export interface IRemovePatch {
  patchType: PatchType.REMOVE;
  domNode: Node;
}

export interface IPropertiesPatch {
  patchType: PatchType.PROPERTIES;
  attributes: IAttributes;
  domNode: Node;
}

export interface ITextPatch {
  patchType: PatchType.TEXT;
  value: string;
  domNode: Node;
}

export type Patch =
  | IAppendPatch
  | IReplacePatch
  | IRemovePatch
  | IPropertiesPatch
  | ITextPatch;

export interface INode {
  nodeType: NodeType.NODE;
  tagName: string;
  attributes: IAttributes;
  children: INode[];
}

export interface IText {
  nodeType: NodeType.TEXT;
  value: string;
}

export type Html = INode | IText;

export type RelaxedHtml = Html | string;

export class NodeCache extends WeakMap<Html, Node> {
  public replace(oldKey: Html, newKey: Html) {
    const value: Node = this.get(oldKey)!;
    this.delete(oldKey);
    this.set(newKey, value);
    return value;
  }
}
