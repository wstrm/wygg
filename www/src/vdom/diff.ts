import { Html, NodeCache, NodeType, PatchType } from "./types";

export function diff(oldNode: Html, newNode: Html, cache: NodeCache): Patch[] {
  const patches: Patch[] = [];
  runDiff(oldNode, newNode, patches, cache);
  return patches;
}

function runDiff(
  oldNode: Html,
  newNode: Html,
  patches: Patch[],
  cache: NodeCache
): void {
  if (oldNode === newNode) {
    return; // No-op, same node, assume no differences.
  }

  const domNode: Node = cache.replace(oldNode, newNode);

  if (oldNode.nodeType !== newNode.nodeType) {
    patches.push({
      domNode,
      node: newNode,
      patchType: PatchType.REPLACE
    });
  } else {
    // Same node type.
    switch (oldNode.nodeType) {
      case NodeType.TEXT:
        patches.push({
          domNode,
          patchType: PatchType.TEXT,
          value: (newNode as IText).value
        });
        return;

      case NodeType.NODE:
        // Different tag name, replace whole node with new one.
        if (oldNode.tagName !== (newNode as INode).tagName) {
          patches.push({
            domNode,
            node: newNode,
            patchType: PatchType.REPLACE
          });
        } else {
          const propertiesDiff: IAttributes | undefined = diffAttributes(
            oldNode.attributes,
            (newNode as INode).attributes
          );
          if (propertiesDiff !== undefined) {
            patches.push({
              attributes: propertiesDiff,
              domNode,
              patchType: PatchType.PROPERTIES
            });
          }

          diffChildren(
            oldNode,
            newNode as INode,
            domNode as HTMLElement,
            patches,
            cache
          );
        }
        return;

      default:
        throw new Error(`Non-exhaustive match for ${oldNode as never}`);
    }
  }
}

function diffAttributes(
  oldAttributes: IAttributes,
  newAttributes: IAttributes
): IAttributes | undefined {
  let attrDiff: IAttributes | undefined; // = undefined

  for (const key in oldAttributes) {
    if (oldAttributes[key] !== newAttributes[key]) {
      attrDiff = attrDiff || {};
      attrDiff[key] = newAttributes[key];
    }
  }

  for (const key in newAttributes) {
    if (oldAttributes[key] === undefined) {
      attrDiff = attrDiff || {};
      attrDiff[key] = newAttributes[key];
    }
  }
}

function diffChildren(
  oldParent: INode,
  newParent: INode,
  parentNode: HTMLElement,
  patches: Patch[],
  cache: NodeCache
): void {
  const oldChildren: Html[] = oldParent.children;
  const newChildren: Html[] = newParent.children;
  const len: number = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < len; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    // Append new child.
    if (oldChild === undefined) {
      patches.push({
        domNode: parentNode,
        node: newChild,
        patchType: PatchType.APPEND
      });

      // Remove old child.
    } else if (newChild === undefined) {
      patches.push({
        domNode: cache.get(oldChild)!,
        patchType: PatchType.REMOVE
      });

      // Let runDiff (recursively) take care of the other cases.
    } else {
      runDiff(oldChild, newChild, patches, cache);
    }
  }
}
