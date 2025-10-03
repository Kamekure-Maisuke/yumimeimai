import {
  Uint8ArrayReader,
  Uint8ArrayWriter,
  ZipReader,
  ZipWriter,
} from "@zip-js/zip-js";

async function fileExist(path: string) {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function zip(paths: string[], outputPath: string) {
  if (!paths?.length) {
    console.log("パスを指定してください。");
    return false;
  }

  const zipWriter = new ZipWriter(new Uint8ArrayWriter());

  for (const path of paths) {
    if (await fileExist(path)) {
      const content = await Deno.readFile(path);
      await zipWriter.add(path, new Uint8ArrayReader(content));
    }
  }
  const zipData = await zipWriter.close();
  await Deno.writeFile(outputPath, zipData);
}

export async function unzip(zipPath: string, outputDir: string) {
  if (!await fileExist(zipPath)) {
    console.log("ZIPファイルが存在しません。");
    return false;
  }

  const zipData = await Deno.readFile(zipPath);
  const zipReader = new ZipReader(new Uint8ArrayReader(zipData));
  const entries = await zipReader.getEntries();

  for (const entry of entries) {
    if (!entry.directory) {
      const writer = new Uint8ArrayWriter();
      const data = await entry.getData!(writer);
      const outputPath = `${outputDir}/${entry.filename}`;
      await Deno.mkdir(outputPath.substring(0, outputPath.lastIndexOf("/")), {
        recursive: true,
      });
      await Deno.writeFile(outputPath, data);
    }
  }

  await zipReader.close();
}
