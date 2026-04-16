# Wan Scripts

Utility scripts for converting and processing content in the Wan topic folder.

## Setup

```bash
cd scripts
npm install
```

## JSON-to-Markdown Converter

Converts structured JSON content files from `orignal/` into well-formatted Markdown files in `md/`, preserving the folder structure. Also downloads referenced images to `asset/`.

### Usage

```bash
# Convert all new files + download missing images
npm run convert

# Preview what would be converted (no files written, no downloads)
npm run convert:dry

# Convert markdown only, skip image downloads
npm run convert:no-images

# Convert a single file
npx ts-node src/convert-json-to-md.ts --file "../orignal/2_成长战略/206_主动高认知负荷.json"

# Force overwrite existing md files
npx ts-node src/convert-json-to-md.ts --force

# Combine flags
npx ts-node src/convert-json-to-md.ts --file "../orignal/1_基本世界观/101_叙事.json" --force
```

### CLI Flags

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview mode. Shows what would be converted without writing files. |
| `--force` | Overwrite existing `.md` files. By default, existing files are skipped. |
| `--file <path>` | Convert a single JSON file instead of scanning the entire `orignal/` directory. |
| `--no-images` | Skip image downloading. Only convert markdown. |

### How It Works

1. Recursively scans `orignal/` for `.json` files
2. Skips empty files (0 bytes or empty content array)
3. Skips files that already have a corresponding `.md` in `md/` (unless `--force`)
4. Parses the JSON structure and converts each content block to Markdown
5. Writes the output to `md/` mirroring the folder structure
6. Scans all image blocks and downloads missing images to `asset/` (skips already-existing files)

### JSON Structure

Each source file has the following top-level structure:

```json
{
  "code": 0,
  "data": {
    "article": { ... },   // optional metadata
    "content": "[...]"     // JSON string containing an array of content blocks
  }
}
```

The `content` field is a **JSON-encoded string** that, when parsed, yields an array of content blocks.

### Content Block Types

| Block Type | JSON Shape | Markdown Output |
|------------|-----------|-----------------|
| `audio` | `{ type, title, desc, duration }` | `🔊 **title** \| desc \| MM:SS` |
| `paragraph` | `{ type, contents: TextSpan[], justify }` | Plain text with inline formatting |
| `paragraph` (center) | `{ justify: "center" }` | `<p align="center">text</p>` |
| `image` | `{ type, url, width, height }` | `![](../../asset/{id}.{ext})` |
| `blockquote` | `{ type, contents: TextSpan[] }` | `> line1`<br>`> line2` |
| `header` | `{ type, level, contents: TextSpan[] }` | `# text` (level 1), `## text` (level 2), etc. |
| `list` | `{ type, ordered, contents: TextSpan[][] }` | `- item` (unordered) or `1. item` (ordered) |
| `elite` | `{ type, contents: TextSpan[] }` | Blockquote with 📌 精华摘要 header |

### Inline Text Formatting (TextSpan)

Each `paragraph`, `blockquote`, `header`, and `elite` block contains a `contents` array of `TextSpan` objects:

```json
{
  "type": "text",
  "text": {
    "content": "some text",
    "bold": true,       // → **text**
    "italic": true,     // → *text*
    "highlight": true,  // → ==text==
    "link": "url"       // → [text](url)
  }
}
```

Multiple flags can be combined on a single span.

### Image Asset Naming

Image URLs follow this CDN pattern:

```
https://piccdn2.umiwi.com/uploader/image/ddarticle/2026032420/1905200052444423072/032420.png
```

The converter extracts the **numeric ID** (second-to-last path segment) and appends the **file extension** from the last segment:

```
1905200052444423072.png → ![](../../asset/1905200052444423072.png)
```

### Adding New Block Types

If you encounter an `[warn] Unknown block type: xxx` message:

1. Inspect the JSON structure of the new block type (use `python3 -c` or `jq` to pretty-print)
2. Add a new interface in `src/convert-json-to-md.ts` (e.g., `interface XxxBlock`)
3. Add it to the `ContentBlock` union type
4. Write a `convertXxx()` function
5. Add a `case "xxx"` to the switch in `convertContentToMarkdown()`
