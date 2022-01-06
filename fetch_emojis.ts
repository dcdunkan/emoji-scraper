// This script helps you to fetch the latest emoji list on specific platforms.
// This script is not perfect rn. How it works? -- It fetches the links to all emojis.
// Then it goes through all that links, get the emoji character and stores it.
// This process takes a lot of time. But it can be done even faster, but idk.
// Please PR if you can make this faster or better.

import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

const emojis: { [name: string]: string } = {};

let ts = "export default {";

/**
 * @param pack: Should be a emojipedia pack page where emoji images are inside a unordered list with class `emoji-grid`.
 * Examples: apple, microsoft, whatsapp, google, etc. By default "apple".
 */
const fetchEmojis = async (pack: string) => {
  console.log("Fetching emoji list...");
  const emojiPaths = await getEmojiPaths(pack);
  console.log(`Found ${emojiPaths.length} emojis.\n`);

  for (let i = 0; i < emojiPaths.length; i++) {
    let path = emojiPaths[i];
    const url = `https://emojipedia.org/${path}/`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`not ok for ${path}, response: ${res.statusText}`);
      continue; // Skips that emoji.
    }
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html")!;
    const textbox = doc.getElementById("emoji-copy")!;
    const emoji = textbox.attributes.value;
    path = path.replace(/-/g, "_");
    emojis[path] = emoji;
    ts += `\n  /** ${emoji} ${toTitleCase(path)} */\n  "${path}": "${emoji}",`;
    console.log(`[${i + 1}/${emojiPaths.length}] ${emoji} - ${path} done`); // success.
  }

  Deno.writeTextFileSync("emojis.json", JSON.stringify(emojis));
  console.log(`Wrote ${emojiPaths.length} emojis to 'emojis.json'`);

  ts += `\n};`;
  Deno.writeTextFileSync("emojis.ts", ts);
  console.log(`Wrote ${emojiPaths.length} emojis to 'emojis.ts'`);

  return emojis;
};

await fetchEmojis(Deno.args[0] ?? "apple");

async function getEmojiPaths(pack: string): Promise<string[]> {
  const url = `https://emojipedia.org/${pack}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch emoji list from ${url}.`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html")!;
  const paths: string[] = [];

  const list = doc
    .getElementsByClassName("emoji-grid")[0]
    .getElementsByTagName("li");

  for (const emoji of list) {
    const path = emoji.getElementsByTagName("a")[0].attributes.href;
    // removes the '/' (slashes) from the beginning and the end.
    paths.push(path.substring(1, path.length - 1));
  }

  return paths;
}

// For the JSDoc comments.
function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
