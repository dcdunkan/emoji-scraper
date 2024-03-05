const QUALIFICATIONS = [
  "fully-qualified",
  "minimally-qualified",
  "unqualified",
  "component",
] as const;

type Qualification = (typeof QUALIFICATIONS)[number];

export interface Emoji {
  identifier: string;
  name: string;
  emoji: string;
  qualification: Qualification;
  group: string;
  subgroup: string;
}

export interface ScrapeOptions {
  dedupeQualifications: boolean;
}

const DEFAULT_SCRAPE_OPTIONS: ScrapeOptions = {
  dedupeQualifications: false,
};

export async function fetchEmoji(
  version: string,
  options: Partial<ScrapeOptions> = {},
): Promise<Emoji[]> {
  const opts: ScrapeOptions = {
    ...DEFAULT_SCRAPE_OPTIONS,
    ...options,
  };

  const url = `https://unicode.org/Public/emoji/${version}/emoji-test.txt`;
  const response = await fetch(url);
  if (!response.ok) {
    console.log(response);
    throw new Error(`Failed to fetch ${url}`);
  }

  const emoji: Emoji[] = [];
  let group = "", subgroup = "";

  const rawContent = await response.text();
  const rawLines = rawContent.split("\n");
  const startingLineIndex = rawLines.findIndex((line) => !line.startsWith("#"));

  for (let i = startingLineIndex; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const lineSegments = rawLine.trim().split(/\s+/);
    const lineType = resolveLineType(lineSegments);

    if (lineType === "group-title") {
      group = lineSegments.slice(2).join(" ");
    } else if (lineType === "subgroup-title") {
      subgroup = lineSegments.slice(2).join(" ");
    } else if (lineType === "emoji") {
      const parsed = parseEmojiLine(lineSegments);
      emoji.push({
        name: parsed.name,
        identifier: parsed.identifier,
        emoji: parsed.emoji,
        qualification: parsed.qualification,
        group: group ?? "",
        subgroup: subgroup || "",
      });
    } else continue;
  }

  if (opts.dedupeQualifications) {
    return emoji.filter((e0) =>
      (e0.qualification === "fully-qualified" ||
        e0.qualification === "component") ||
      ((e0.qualification === "unqualified" ||
        e0.qualification === "minimally-qualified") &&
        emoji.find((e1) =>
            e1.qualification === "fully-qualified" &&
            e1.identifier === e0.identifier &&
            e1.emoji === e0.emoji
          ) != null)
    );
  } else {
    return emoji;
  }
}

function resolveLineType(segments: string[]) {
  const semiColon = segments.indexOf(";");
  return segments[0] === "#"
    ? segments[1] === "group:"
      ? "group-title"
      : segments[1] === "subgroup:"
      ? "subgroup-title"
      : segments[segments.length - 2] === "subtotal:"
      ? "count"
      : segments[segments.length - 4] === "subtotal:"
      ? "wo-count"
      : "unknown"
    : semiColon !== -1 &&
        QUALIFICATIONS.includes(
          segments[semiColon + 1] as Qualification,
        ) &&
        segments[semiColon + 2] === "#"
    ? "emoji"
    : "unknown";
}

function parseEmojiLine(segments: string[]) {
  const semiColonPos = segments.indexOf(";");
  const qualification = segments[semiColonPos + 1] as Qualification;
  const emoji = segments[semiColonPos + 3];
  const name = segments.slice(semiColonPos + 5).join(" ");
  const identifier = name.replace(/[^a-zA-Z1-9]/g, "_")
    .replace(/[_]+/g, "_").toLowerCase();
  const emojiFromCodepoints = String.fromCodePoint(
    ...segments.slice(0, semiColonPos)
      .map((codepoint) => parseInt(codepoint, 16)),
  );
  if (emojiFromCodepoints !== emoji) {
    throw new Error(name + " mismatching emoji");
  }
  return { identifier, name, emoji, qualification };
}
