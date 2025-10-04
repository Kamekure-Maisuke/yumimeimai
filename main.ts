import { markdownToHtml } from "./lib.ts";

const html = await markdownToHtml("README.md");
if (html === false) {
  console.log("マークダウンファイルを指定してください。");
  Deno.exit(1);
}
await Deno.writeTextFile("sample.html", html);
