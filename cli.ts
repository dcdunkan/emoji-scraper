import { parseArgs } from "jsr:@std/cli@1/parse-args";
import { fetchEmoji } from "./mod.ts";
import {
    type FormatOptions,
    makeJSONFileContent,
    makeTypeScriptFileContent,
} from "./utilities.ts";

const CLI_VERSION = "v0.2.0";

const args = parseArgs(Deno.args, {
    boolean: ["version", "help", "ts", "json", "dedupe", "map", "minimal"],
    string: ["output", "unicode-version"],
    alias: {
        "output": "o",
        "unicode-version": "v",
    },
    default: {
        json: true,
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

function warn(message: string) {
    console.log(`%cwarn%c: ${message}`, "color: orange", "color: none");
}

if (args.help) {
    leave(`Emoji Scraper: A CLI tool for scraping emoji list from
https://unicode.org by a specified version.

FETCH OPTIONS
 --unicode-version -v
    Specify any valid Unicode version. Omitting this operator
    will make the CLI fetch the latest version. Find all the
    valid Unicode versions here: https://unicode.org/Public/emoji/.
 --dedupe
    Dedupe the emojis based on their qualifications.

OUTPUT OPTIONS
 --output -o
    Where to save the TypeScript/JSON output of the emoji list.
    By default the output is streamed to STDOUT.
 --ts
    Output as TypeScript. Cannot be used with --json.
 --json
    Output as JSON. Cannot be used with --ts.
 --map
    Output an identifier to value object instead of the default array.
 --minimal
    Only include the identifier and the emoji itself (drops the other info)

 --version
    Print the scraper version.
 --help
    Print this help message.

For more information and for reporting issues, see
https://github.com/dcdunkan/emoji-scraper.`);
}

if (args.version) {
    leave(`emoji-scraper ${CLI_VERSION}`);
}

if (args.ts && args.json) {
    warn("either specify --ts or --json for output format");
}

if (!args["unicode-version"]?.trim()) {
    warn("Unicode version is not specified, fetching the latest");
}

const version = args["unicode-version"]?.trim() || "latest";
console.log(`fetching ${version} emoji list`);
const emoji = await fetchEmoji(version, { dedupeQualifications: args.dedupe });

console.log(`fetched ${emoji.length} of unicode v${version} emoji`);

const formatOptions: FormatOptions = {
    map: args.map,
    minimal: args.minimal,
    useTabs: false,
    indentSize: 2,
};

const fileContent = args.ts
    ? makeTypeScriptFileContent(emoji, { ...formatOptions })
    : makeJSONFileContent(emoji, { ...formatOptions });

if (args.output) {
    await Deno.writeTextFile(args.output, fileContent);
    console.log(`written emoji list to ${args.output}`);
} else {
    console.log(fileContent);
}
