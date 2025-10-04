import { assertEquals, assertStringIncludes } from "@std/assert";
import { markdownToHtml, unzip, zip } from "./lib.ts";

Deno.test({
  name: "zip creates archive from files",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const testFile = await Deno.makeTempFile();
    await Deno.writeTextFile(testFile, "test content");
    const zipPath = await Deno.makeTempFile({ suffix: ".zip" });

    await zip([testFile], zipPath);

    const stat = await Deno.stat(zipPath);
    assertEquals(stat.size > 0, true);

    await Deno.remove(testFile);
    await Deno.remove(zipPath);
  },
});

Deno.test({
  name: "unzip extracts files",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const testFile = await Deno.makeTempFile();
    await Deno.writeTextFile(testFile, "test content");
    const zipPath = await Deno.makeTempFile({ suffix: ".zip" });
    const outputDir = await Deno.makeTempDir();

    await zip([testFile], zipPath);
    await unzip(zipPath, outputDir);

    const content = await Deno.readTextFile(`${outputDir}/${testFile}`);
    assertEquals(content, "test content");

    await Deno.remove(testFile);
    await Deno.remove(zipPath);
    await Deno.remove(outputDir, { recursive: true });
  },
});

Deno.test({
  name: "markdownToHtml converts markdown to HTML",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const mdFile = await Deno.makeTempFile({ suffix: ".md" });
    await Deno.writeTextFile(mdFile, "# Hello\n\nThis is a **test**.");

    const html = await markdownToHtml(mdFile);

    assertEquals(typeof html, "string");
    assertStringIncludes(html as string, "<!DOCTYPE html>");
    assertStringIncludes(html as string, '<html lang="ja">');
    assertStringIncludes(html as string, "markdown-body");
    assertStringIncludes(html as string, "<h1");
    assertStringIncludes(html as string, "Hello");
    assertStringIncludes(html as string, "<strong>test</strong>");

    await Deno.remove(mdFile);
  },
});
