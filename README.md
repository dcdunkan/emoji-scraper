# Emoji Scraper

Scrape emoji used by a vendor or platform from [Emojipedia](https://emojipedia.org).

### CLI Usage

> You need [Deno](https://deno.land) to use this tool.

You can run the CLI script if you want to scrape the emojis from your CLI:

If it is a one-time use:

```bash
$ deno run --allow-write --allow-net \
  https://raw.githubusercontent.com/dcdunkan/emoji-scraper/main/cli.ts \
  [options]
```

Otherwise, it'll be better to install the script:

```bash
$ deno install --allow-write --allow-net \
  https://raw.githubusercontent.com/dcdunkan/emoji-scraper/main/cli.ts \
  --name emoji-scraper # if you want to rename the executable.
$ emoji-scraper [options]
```

See the `--help` argument for more information.

**Example Usage**:

```bash
$ emoji-scraper --vendor twitter --json --output emoji.json
```

### Module

```ts
import {
  fetchEmoji
} from "https://raw.githubusercontent.com/dcdunkan/emoji-scraper/main/mod.ts";

const emoji = await fetchEmoji("apple"); // <-- vendor/platform
console.log(emoji); // array of `Emoji` type.
```
