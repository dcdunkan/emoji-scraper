# Emoji Fetch [🦕](https://deno.land)

Fetches emojis under a pack from [Emojipedia](https://emojipedia.org) and stores them into JSON and TS files. Created for and Used in [@grammyjs/emoji](https://github.com/grammyjs/emoji). This repository contains a [script to fetch](fetch_emojis.ts) emojis and two **Apple** Emoji list [JSON](emojis.json) & [TS](emojis.ts) files.

Last updated emojis on: `GMT 06 January 2022 09∶09∶35 PM`

## Usage

[Download the executable](https://github.com/dcdunkan/emoji-scraper/releases/latest) for your OS architecture from the [releases](https://github.com/dcdunkan/emoji-scraper/releases/) and run them.

Or clone the repo or download the script and by using [Deno](https://deno.land):

```bash
deno run --allow-net allow-write fetch_emojis.ts
```

By default the script will fetch **Apple (iOS/Mac) emojis** as listed [here](https://emojipedia.org/apple/). But you can change it by adding an argument when running the script or the executable. Example:

For fetching the [emojis by Google](https://emojipedia.org/google/):

```bash
./emoji google
```

Deno:

```bash
deno run --allow-net allow-write fetch_emojis.ts google
```

## About the Script

The script is not perfect. Because it takes around ~1hr. This is probably an one-time build for your projects -- So, that's okay. But it can be even faster and better, for sure. But, right now, I don't have enough skills to do that. But if you do, please open a PR.

## About the Emoji list

Both [JSON](emojis.json) and [TS](emojis.ts) files contains emojis by **Apple**. [The TypeScript file](emojis.ts) has JSDoc comments too. These files were created for [@grammyjs/emoji](https://github.com/grammyjs/emoji).

**Thanks to [Emojipedia](https://emojipedia.org) for the data.**
