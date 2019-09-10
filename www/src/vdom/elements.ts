import { Html, IAttributes, INode, IText, NodeType } from "./types";

function unrelaxHtml(nodes: RelaxedHtml[]): Html[] {
  for(let j = 0; j < nodes.length; j++) {
    const nod = nodes[j];
    if (typeof nod === "string") {
      nodes[j] = text(nod);
    }
  }

  return nodes
}

export const text = (val: string): IText => ({
  nodeType: NodeType.TEXT,
  value: val
});

export const node = (
  tagName: string,
  attributes: IAttributes = {},
  children: RelaxedHtml[] = []
): INode => ({
  attributes,
  children: unrelaxHtml(children),
  nodeType: NodeType.NODE,
  tagName,
});

export const makeNode = (tagName: string) => (
  attributes: IAttributes = {},
  children: RelaxedHtml[] = []
): INode {
  return node(tagName, attributes, children);
}

// Only HTML5 elements.
export const a = makeNode("a");
export const address = makeNode("address");
export const abbr = makeNode("abbr");
export const area = makeNode("area");
export const article = makeNode("article");
export const aside = makeNode("aside");
export const audio = makeNode("audio");
export const b = makeNode("b");
export const base = makeNode("base");
export const bdi = makeNode("bdi");
export const bdo = makeNode("bdo");
export const blockquote = makeNode("blockquote");
export const body = makeNode("body");
export const br = makeNode("br");
export const button = makeNode("button");
export const canvas = makeNode("canvas");
export const caption = makeNode("caption");
export const cite = makeNode("cite");
export const code = makeNode("code");
export const col = makeNode("col");
export const colgroup = makeNode("colgroup");
export const data = makeNode("data");
export const datalist = makeNode("datalist");
export const dd = makeNode("dd");
export const del = makeNode("del");
export const details = makeNode("details");
export const dfn = makeNode("dfn");
export const dialog = makeNode("dialog");
export const div = makeNode("div");
export const dl = makeNode("dl");
export const dt = makeNode("dt");
export const em = makeNode("em");
export const embed = makeNode("embed");
export const fieldset = makeNode("fieldset");
export const figure = makeNode("figure");
export const footer = makeNode("footer");
export const form = makeNode("form");
export const h1 = makeNode("h1");
export const h2 = makeNode("h2");
export const h3 = makeNode("h3");
export const h4 = makeNode("h4");
export const h5 = makeNode("h5");
export const h6 = makeNode("h6");
export const head = makeNode("head");
export const header = makeNode("header");
export const hr = makeNode("hr");
export const html = makeNode("html");
export const i = makeNode("i");
export const iframe = makeNode("iframe");
export const img = makeNode("img");
export const input = makeNode("input");
export const ins = makeNode("ins");
export const kbd = makeNode("kbd");
export const label = makeNode("label");
export const legend = makeNode("legend");
export const li = makeNode("li");
export const link = makeNode("link");
export const main = makeNode("main");
export const map = makeNode("map");
export const mark = makeNode("mark");
export const meta = makeNode("meta");
export const meter = makeNode("meter");
export const nav = makeNode("nav");
export const noscript = makeNode("noscript");
export const objectE = makeNode("object");
export const ol = makeNode("ol");
export const optgroup = makeNode("optgroup");
export const option = makeNode("option");
export const output = makeNode("output");
export const p = makeNode("p");
export const param = makeNode("param");
export const picture = makeNode("picture");
export const pre = makeNode("pre");
export const progress = makeNode("progress");
export const q = makeNode("q");
export const rp = makeNode("rp");
export const rt = makeNode("rt");
export const ruby = makeNode("ruby");
export const s = makeNode("s");
export const samp = makeNode("samp");
export const script = makeNode("script");
export const section = makeNode("section");
export const select = makeNode("select");
export const small = makeNode("small");
export const span = makeNode("span");
export const strong = makeNode("strong");
export const style = makeNode("style");
export const sub = makeNode("sub");
export const summary = makeNode("summary");
export const sup = makeNode("sup");
export const svg = makeNode("svg");
export const table = makeNode("table");
export const tbody = makeNode("tbody");
export const td = makeNode("td");
export const template = makeNode("template");
export const textarea = makeNode("textarea");
export const tfoot = makeNode("tfoot");
export const th = makeNode("th");
export const thead = makeNode("thead");
export const time = makeNode("time");
export const title = makeNode("title");
export const tr = makeNode("tr");
export const track = makeNode("track");
export const u = makeNode("u");
export const ul = makeNode("ul");
export const varE = makeNode("var");
export const video = makeNode("video");
export const wbr = makeNode("wbr");
