import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { parse } from "https://deno.land/std@0.186.0/path/mod.ts";

export interface Emoji {
  identifier: string;
  name: string;
  emoji: string;
}

export async function fetchEmoji(vendor: string): Promise<Emoji[]> {
  const url = `https://emojipedia.org/${vendor}/`;
  const response = await fetch(url);
  if (!response.ok) {
    console.log(response);
    throw new Error(`Failed to fetch ${url}`);
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (doc == null) throw new Error("No document!");
  return doc.getElementsByClassName("emoji-grid")[0]
    .getElementsByTagName("img")
    .map((img) => {
      const name = img.getAttribute("title")!;
      const src = img.getAttribute("data-src") || img.getAttribute("src")!;
      const [_id, ...parts] = parse(src).name.split("_");
      const identifier = name.replace(/[^a-zA-Z1-9]/g, "_")
        .replace(/[_]+/g, "_").toLowerCase();
      const emoji = parts[parts.length == 3 ? 1 : 0].split("-")
        .map((unicode) => String.fromCodePoint(parseInt(unicode, 16))).join("");
      return { identifier, name, emoji };
    });
}
