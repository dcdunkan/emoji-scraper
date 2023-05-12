import { parse } from "https://deno.land/std@0.186.0/flags/mod.ts";
import { fetchEmoji } from "./mod.ts";
import { makeJSONFileContent, makeTypeScriptFileContent } from "./utilities.ts";

const CLI_VERSION = "v0.1.0";

const args = parse(Deno.args, {
  boolean: ["version", "help", "ts", "json"],
  string: ["output", "vendor"],
  alias: {
    "output": "o",
    "vendor": "v",
  },
  unknown: (arg) => {
    console.log(`Unknown argument: ${arg}. See --help`);
    Deno.exit(1);
  },
});

function leave(...message: string[]) {
  if (message.length) console.log(...message);
  Deno.exit(0);
}

function error(message: string) {
  console.log(`%cerror%c: ${message}`, "color: red", "color: none");
  Deno.exit(1);
}

if (args.help) {
  leave(`Emoji Scraper: A CLI tool for scraping emoji list from
https://emojipedia.org by a vendor or platform. 

 --help
    Print help message.
 --vendor -v
    Specify vendor name as in the pathname of an Emojipedia
    vendor/platform page URL. Defaults to 'apple'. You can
    find all vendors here: https://emojipedia.org/vendors.
 --output -o
    Where to output the TypeScript output of the emoji list.
    By default the output is printed out to the terminal.
 --version
    Print the scraper version.`);
}

if (args.version) {
  leave(`emoji-scraper ${CLI_VERSION}`);
}

if (!args.ts && !args.json) {
  error("either specify --ts or --json for output format");
}
if (args.ts && args.json) {
  error("only specify either one of --ts and --json");
}

if (!args.vendor?.trim()) {
  console.log(
    "%cinfo%c: vendor is not specified, using 'apple'",
    "color: yellow",
    "color: none",
  );
}

const vendor = args.vendor?.trim() || "apple";
console.log(`fetching ${vendor} emoji list`);
const emoji = await fetchEmoji(vendor);
console.log(`fetched ${emoji.length} ${vendor} emoji`);

const fileContent = args.json
  ? makeJSONFileContent(emoji)
  : makeTypeScriptFileContent(emoji);

if (args.output) {
  await Deno.writeTextFile(args.output, fileContent);
  console.log(`written emoji list to ${args.output}`);
} else {
  console.log(fileContent);
}
