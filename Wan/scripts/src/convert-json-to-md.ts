import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// ---------------------------------------------------------------------------
// Types — mirrors the JSON content-block schema
// ---------------------------------------------------------------------------

interface TextSpan {
  type: "text";
  text: {
    content: string;
    bold?: boolean;
    italic?: boolean;
    highlight?: boolean;
    link?: string;
  };
}

interface AudioBlock {
  type: "audio";
  title: string;
  desc: string;
  duration: number; // seconds
  [key: string]: unknown;
}

interface ParagraphBlock {
  type: "paragraph";
  contents: TextSpan[];
  justify?: "left" | "center" | "right";
  text: string;
}

interface ImageBlock {
  type: "image";
  url: string;
  width: number;
  height: number;
  legend?: string;
  [key: string]: unknown;
}

interface BlockquoteBlock {
  type: "blockquote";
  contents: TextSpan[];
  text: string;
}

interface EliteBlock {
  type: "elite";
  contents: TextSpan[];
  text: string;
}

interface HeaderBlock {
  type: "header";
  level: number; // 1–6
  contents: TextSpan[];
  text: string;
  justify?: string;
}

interface ListBlock {
  type: "list";
  ordered: boolean;
  contents: TextSpan[][]; // each item is an array of spans
}

type ContentBlock =
  | AudioBlock
  | ParagraphBlock
  | ImageBlock
  | BlockquoteBlock
  | EliteBlock
  | HeaderBlock
  | ListBlock;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format seconds → "MM:SS" */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Extract asset filename from a CDN URL.
 * URL pattern: .../2026032420/1905200052444423072/032420.png
 * Result:      1905200052444423072.png  (numeric ID + extension)
 */
function extractFilename(url: string): string {
  const parts = url.split("/");
  const lastSegment = parts[parts.length - 1]; // e.g. "032420.png"
  const idSegment = parts[parts.length - 2]; // e.g. "1905200052444423072"
  const ext = path.extname(lastSegment); // e.g. ".png"
  return `${idSegment}${ext}`;
}

/** Render an array of TextSpan into inline markdown */
function renderSpans(spans: TextSpan[]): string {
  return spans
    .map((span) => {
      if (span.type !== "text") return "";
      const t = span.text;
      let content = t.content;

      // Newlines inside spans are literal — keep them
      if (content === "\n") return "\n";

      // Apply inline formatting
      if (t.link) {
        content = `[${content}](${t.link})`;
      }
      if (t.bold) {
        content = `**${content}**`;
      }
      if (t.italic) {
        content = `*${content}*`;
      }
      if (t.highlight) {
        content = `==${content}==`;
      }

      return content;
    })
    .join("");
}

// ---------------------------------------------------------------------------
// Block → Markdown converters
// ---------------------------------------------------------------------------

function convertAudio(block: AudioBlock): string {
  const dur = formatDuration(block.duration);
  return `\u{1F50A} **${block.title}** | ${block.desc} | ${dur}`;
}

function convertParagraph(block: ParagraphBlock): string {
  // Centered decorative separators (e.g. ✵)
  if (block.justify === "center") {
    const text = block.text.trim();
    return `<p align="center">${text}</p>`;
  }

  return renderSpans(block.contents);
}

function convertImage(block: ImageBlock): string {
  const filename = extractFilename(block.url);
  return `![](../../asset/${filename})`;
}

function convertBlockquote(block: BlockquoteBlock): string {
  const text = renderSpans(block.contents);
  // Split into lines, prefix each with "> "
  return text
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

function convertHeader(block: HeaderBlock): string {
  const prefix = "#".repeat(block.level) + " ";
  const text = renderSpans(block.contents);
  return `${prefix}${text}`;
}

function convertList(block: ListBlock): string {
  return block.contents
    .map((itemSpans, i) => {
      const text = renderSpans(itemSpans);
      const prefix = block.ordered ? `${i + 1}. ` : "- ";
      return `${prefix}${text}`;
    })
    .join("\n");
}

function convertElite(block: EliteBlock): string {
  const text = renderSpans(block.contents);
  const lines = text.split("\n");
  const body = lines.map((line) => `> ${line}`).join("\n");
  return `> **\u{1F4CC} \u7CBE\u534E\u6458\u8981**\n>\n${body}`;
}

// ---------------------------------------------------------------------------
// Main conversion: JSON string → Markdown string
// ---------------------------------------------------------------------------

function convertContentToMarkdown(contentJson: string): string {
  const blocks: ContentBlock[] = JSON.parse(contentJson);
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "audio":
        parts.push(convertAudio(block));
        break;
      case "paragraph":
        parts.push(convertParagraph(block));
        break;
      case "image":
        parts.push(convertImage(block));
        break;
      case "blockquote":
        parts.push(convertBlockquote(block));
        break;
      case "elite":
        parts.push(convertElite(block));
        break;
      case "header":
        parts.push(convertHeader(block));
        break;
      case "list":
        parts.push(convertList(block));
        break;
      default:
        console.warn(
          `  [warn] Unknown block type: ${(block as { type: string }).type}`
        );
        break;
    }
  }

  // Join blocks with double newlines (standard markdown paragraph separator)
  return parts.join("\n\n") + "\n";
}

// ---------------------------------------------------------------------------
// File-system walker
// ---------------------------------------------------------------------------

interface ConvertOptions {
  dryRun: boolean;
  forceOverwrite: boolean;
  singleFile?: string; // convert only this file
}

function findJsonFiles(dir: string): string[] {
  const results: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith(".json")) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results.sort();
}

function getOutputPath(
  jsonPath: string,
  origDir: string,
  mdDir: string
): string {
  const relative = path.relative(origDir, jsonPath);
  return path.join(mdDir, relative.replace(/\.json$/, ".md"));
}

function isEmptyFile(filePath: string): boolean {
  const stat = fs.statSync(filePath);
  if (stat.size === 0) return true;

  // Also check if JSON content array is empty
  try {
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    if (!raw) return true;
    const parsed = JSON.parse(raw);
    const contentStr = parsed?.data?.content;
    if (!contentStr) return true;
    const content = JSON.parse(contentStr);
    return !Array.isArray(content) || content.length === 0;
  } catch {
    return true;
  }
}

function processFile(
  jsonPath: string,
  outputPath: string,
  options: ConvertOptions
): boolean {
  // Skip empty files
  if (isEmptyFile(jsonPath)) {
    console.log(`  [skip] Empty: ${path.basename(jsonPath)}`);
    return false;
  }

  // Skip if md already exists (unless --force)
  if (!options.forceOverwrite && fs.existsSync(outputPath)) {
    console.log(`  [skip] Exists: ${path.basename(outputPath)}`);
    return false;
  }

  // Parse JSON
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const parsed = JSON.parse(raw);
  const contentStr: string = parsed?.data?.content;

  if (!contentStr) {
    console.log(`  [skip] No content field: ${path.basename(jsonPath)}`);
    return false;
  }

  // Convert
  const markdown = convertContentToMarkdown(contentStr);

  if (options.dryRun) {
    console.log(`  [dry-run] Would write: ${outputPath}`);
    return true;
  }

  // Ensure output directory exists
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, markdown, "utf-8");
  console.log(`  [converted] ${path.basename(jsonPath)} -> ${outputPath}`);
  return true;
}

// ---------------------------------------------------------------------------
// Image downloading
// ---------------------------------------------------------------------------

interface ImageInfo {
  url: string;
  filename: string; // e.g. "1905200052444423072.png"
}

/** Extract all image URLs from a JSON content string */
function collectImages(contentJson: string): ImageInfo[] {
  const blocks: ContentBlock[] = JSON.parse(contentJson);
  const images: ImageInfo[] = [];
  for (const block of blocks) {
    if (block.type === "image") {
      images.push({
        url: block.url,
        filename: extractFilename(block.url),
      });
    }
  }
  return images;
}

/** Collect all image URLs from all non-empty JSON files */
function collectAllImages(jsonFiles: string[]): ImageInfo[] {
  const all: ImageInfo[] = [];
  const seen = new Set<string>();

  for (const jsonPath of jsonFiles) {
    if (isEmptyFile(jsonPath)) continue;
    try {
      const raw = fs.readFileSync(jsonPath, "utf-8");
      const parsed = JSON.parse(raw);
      const contentStr: string = parsed?.data?.content;
      if (!contentStr) continue;
      for (const img of collectImages(contentStr)) {
        if (!seen.has(img.filename)) {
          seen.add(img.filename);
          all.push(img);
        }
      }
    } catch {
      // skip unparseable files
    }
  }
  return all;
}

/** Download a single file from URL to destPath */
function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (res) => {
        // Follow redirects
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          downloadFile(res.headers.location, destPath)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }

        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });
        fileStream.on("error", reject);
      })
      .on("error", reject);
  });
}

/** Download all missing images to assetDir */
async function downloadMissingImages(
  images: ImageInfo[],
  assetDir: string,
  dryRun: boolean
): Promise<{ downloaded: number; skipped: number; failed: number }> {
  if (!fs.existsSync(assetDir)) {
    fs.mkdirSync(assetDir, { recursive: true });
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const img of images) {
    const destPath = path.join(assetDir, img.filename);
    if (fs.existsSync(destPath)) {
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  [dry-run] Would download: ${img.filename}`);
      downloaded++;
      continue;
    }

    try {
      await downloadFile(img.url, destPath);
      console.log(`  [downloaded] ${img.filename}`);
      downloaded++;
    } catch (err) {
      console.error(
        `  [error] Failed to download ${img.filename}: ${(err as Error).message}`
      );
      failed++;
    }
  }

  return { downloaded, skipped, failed };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const forceOverwrite = args.includes("--force");
  const skipImages = args.includes("--no-images");
  const fileIdx = args.indexOf("--file");
  const singleFile = fileIdx !== -1 ? args[fileIdx + 1] : undefined;

  // Resolve paths relative to the project root (one level up from scripts/)
  const projectRoot = path.resolve(__dirname, "../..");
  const origDir = path.join(projectRoot, "orignal");
  const mdDir = path.join(projectRoot, "md");
  const assetDir = path.join(projectRoot, "asset");

  if (!fs.existsSync(origDir)) {
    console.error(`Error: orignal/ directory not found at ${origDir}`);
    process.exit(1);
  }

  console.log("JSON -> Markdown Converter");
  console.log(`  Source:  ${origDir}`);
  console.log(`  Output:  ${mdDir}`);
  console.log(`  Assets:  ${assetDir}`);
  console.log(`  Mode:    ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`  Force:   ${forceOverwrite ? "YES" : "NO"}`);
  console.log(`  Images:  ${skipImages ? "SKIP" : "DOWNLOAD"}`);
  console.log("");

  let jsonFiles: string[];

  if (singleFile) {
    const fullPath = path.resolve(singleFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`Error: File not found: ${fullPath}`);
      process.exit(1);
    }
    jsonFiles = [fullPath];
  } else {
    jsonFiles = findJsonFiles(origDir);
  }

  // --- Convert markdown ---
  console.log("=== Converting Markdown ===");
  let converted = 0;
  let skipped = 0;

  for (const jsonPath of jsonFiles) {
    const outputPath = getOutputPath(jsonPath, origDir, mdDir);
    const didConvert = processFile(jsonPath, outputPath, {
      dryRun,
      forceOverwrite,
      singleFile,
    });
    if (didConvert) converted++;
    else skipped++;
  }

  console.log(`  Markdown: ${converted} converted, ${skipped} skipped`);

  // --- Download images ---
  if (!skipImages) {
    console.log("");
    console.log("=== Downloading Images ===");
    const allImages = collectAllImages(jsonFiles);
    const result = await downloadMissingImages(allImages, assetDir, dryRun);
    console.log(
      `  Images: ${result.downloaded} downloaded, ${result.skipped} existed, ${result.failed} failed`
    );
  }

  console.log("");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
