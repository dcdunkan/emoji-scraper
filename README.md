# Emoji Scraper

Parser for the emoji data provided by Unicode.

### CLI Usage

> You need [Deno](https://deno.land) to use this tool.

```bash
$ deno run --allow-write --allow-net \
  https://raw.githubusercontent.com/dcdunkan/emoji-scraper/main/cli.ts \
  [options]
```

Provide the argument `--help` to see the available options.

**Example Usage**:

```bash
$ !! --json --dedupe -o latest.json
```

### Module

```ts
import {
  fetchEmoji,
} from "https://raw.githubusercontent.com/dcdunkan/emoji-scraper/main/mod.ts";

const emoji = await fetchEmoji("15.1", { /* options */ });
console.log(emoji); // array of `Emoji` type.
```
