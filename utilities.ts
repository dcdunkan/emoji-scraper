import { Emoji } from "./mod.ts";

export interface FormatOptions {
  useTabs: boolean;
  indentSize: number;
}

// deno-lint-ignore no-empty-interface
export interface JSONFileOptions extends FormatOptions {}

export interface TypeScriptFileOptions extends FormatOptions {
  // lineLength: number;
  singleQuotes: boolean;
  semicolon: boolean;
  jsDocs: boolean;
  defaultExport: boolean;
  exportName?: string;
}

export const defaultJSONFileOptions: JSONFileOptions = {
  indentSize: 2,
  useTabs: false,
};

export const defaultTypeScriptFileOptions: TypeScriptFileOptions = {
  indentSize: 2,
  useTabs: false,
  // lineLength: 80,
  singleQuotes: false,
  semicolon: true,
  jsDocs: true,
  defaultExport: true,
};

export function makeJSONFileContent(
  emoji: Emoji[],
  options: Partial<JSONFileOptions> = {},
) {
  const opts: JSONFileOptions = { ...defaultJSONFileOptions, ...options };
  const indent = opts.useTabs ? "\t" : " ".repeat(opts.indentSize);
  const list = emoji.map((e) => {
    return `${indent}"${e.identifier}": "${e.emoji}",`;
  }).join("\n").slice(0, -1); // remove the last comma.
  return `{\n${list}\n}\n`;
}

export function makeTypeScriptFileContent(
  emoji: Emoji[],
  options: Partial<TypeScriptFileOptions> = {},
): string {
  const opts: TypeScriptFileOptions = {
    ...defaultTypeScriptFileOptions,
    ...options,
  };
  if (!opts.defaultExport && opts.exportName == null) {
    throw new Error("Must specify a 'exportName' if 'defaultExport' is false.");
  }
  const indent = opts.useTabs ? "\t" : " ".repeat(opts.indentSize);
  const quote = opts.singleQuotes ? "'" : '"';
  const semicolon = opts.semicolon ? ";" : "";

  const list = emoji.map((e) => {
    const key = `${quote}${e.identifier}${quote}`;
    const value = `${quote}${e.emoji}${quote}`;
    const line = `${indent}${key}: ${value},`;
    return [
      ...(opts.jsDocs ? [`${indent}/** ${e.emoji} ${e.name} */`] : []),
      // ...(line.length > opts.lineLength
      //  ? [`${indent}${key}:`, `${indent.repeat(2)}${value},`]
      //  : [line]),
      line,
    ].join("\n");
  }).join("\n");

  const exportStatement = opts.defaultExport
    ? `export default {`
    : `export const ${opts.exportName} = {`;

  return `${exportStatement}\n${list}\n}${semicolon}\n`;
}
