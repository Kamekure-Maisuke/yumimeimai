import { zip } from "./lib.ts";

if (import.meta.main) {
  const args = Deno.args;

  if (args.length < 2) {
    console.log(
      "使い方: deno run --allow-read --allow-write main.ts <出力zipファイル> <ファイル1> [ファイル2] ...",
    );
    console.log(
      "例: deno run --allow-read --allow-write main.ts output.zip file1.txt file2.txt",
    );
    Deno.exit(1);
  }

  const [outputPath, ...inputPaths] = args;
  await zip(inputPaths, outputPath);
  console.log(`✓ ${outputPath} を作成しました`);
}
