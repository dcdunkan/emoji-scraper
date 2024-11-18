import { Emoji } from "./mod.ts";

export interface FormatOptions {
    useTabs: boolean;
    indentSize: number;
    map: boolean;
    minimal: boolean;
}

const defaultFormatOptions: FormatOptions = {
    useTabs: false,
    indentSize: 2,
    map: false,
    minimal: false,
};

// deno-lint-ignore no-empty-interface
export interface JSONFileOptions extends FormatOptions {}

export interface TypeScriptFileOptions extends FormatOptions {
    singleQuotes: boolean;
    semicolon: boolean;
    jsDocs: boolean;
    defaultExport: boolean;
    exportName?: string; // not implemented
}

export const defaultJSONFileOptions: JSONFileOptions = {
    ...defaultFormatOptions,
};

export const defaultTypeScriptFileOptions: TypeScriptFileOptions = {
    ...defaultFormatOptions,
    singleQuotes: false,
    semicolon: true,
    jsDocs: true,
    defaultExport: true,
};

export function makeJSONFileContent(
    emoji: Emoji[],
    options: Partial<JSONFileOptions> = {},
): string {
    const opts: JSONFileOptions = { ...defaultJSONFileOptions, ...options };
    const indent = opts.useTabs ? "\t" : " ".repeat(opts.indentSize);
    if (opts.map) {
        const entries = emoji.map((emoji) => [
            emoji.identifier,
            opts.minimal ? emoji.emoji : emoji,
        ]);
        const output = Object.fromEntries(entries);
        return JSON.stringify(output, null, indent);
    } else {
        const output = emoji.map((emoji) => {
            return opts.minimal
                ? { identifier: emoji.identifier, emoji: emoji.emoji }
                : emoji;
        });
        return JSON.stringify(output, null, indent);
    }
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
        throw new Error(
            "Must specify a 'exportName' if 'defaultExport' is false.",
        );
    }
    const indent = opts.useTabs ? "\t" : " ".repeat(opts.indentSize);
    const quote = opts.singleQuotes ? "'" : '"';
    const semicolon = opts.semicolon ? ";" : "";

    if (opts.map) {
        const list = emoji.map((e) => {
            const key = `${quote}${e.identifier}${quote}`;
            const value = opts.minimal
                ? `${quote}${e.emoji}${quote}`
                : "{\n" + JSON.stringify(e, null, indent)
                    .split("\n")
                    .slice(1, -1)
                    .map((line) => indent + line)
                    .join("\n") +
                    `\n${indent}}`;
            const line = `${indent}${key}: ${value},`;
            const docs = opts.jsDocs
                ? `${indent}/** ${e.emoji} ${e.name} */\n`
                : "";
            return docs + "\n" + line;
        }).join("\n");

        const exportStatement = opts.defaultExport
            ? `export default {`
            : `export const ${opts.exportName} = {`;

        return `${exportStatement}\n${list}\n}${semicolon}\n`;
    } else {
        const exportStatement = opts.defaultExport
            ? `export default `
            : `export const ${opts.exportName} = `;
        const output = emoji.map((emoji) => {
            return opts.minimal
                ? { identifier: emoji.identifier, emoji: emoji.emoji }
                : emoji;
        });
        const list = JSON.stringify(output, null, indent);
        return `${exportStatement}${list}${semicolon}\n`;
    }
}
