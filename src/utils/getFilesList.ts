import * as fs from "node:fs";
import * as nodePath from "node:path";
import { EXTENSIONS_TO_ANALYZE } from "../constants/FileExtensions";
import { GlobalConfig } from "../types/Config";

export const getFilesList = (catalogPath: string) => {
  let files: string[] = [];
  const { excludeDirectoriesWithNameContains, excludeFilesContains } =
    GlobalConfig.getInstance();

  function throughDirectory(directory: string) {
    for (const file of fs.readdirSync(directory)) {
      const absolute = nodePath.join(directory, file);
      if (
        fs.statSync(absolute).isDirectory() &&
        !excludeDirectoriesWithNameContains.includes(
          nodePath.basename(absolute)
        )
      ) {
        throughDirectory(absolute);
      } else {
        files.push(absolute);
      }
    }
  }

  throughDirectory(catalogPath);
  files = files.filter((item) => {
    let correctExtension = false;
    for (let extension of EXTENSIONS_TO_ANALYZE) {
      if (item.endsWith(extension)) {
        correctExtension = true;
        break;
      }
    }

    let correctName = true;
    for (let fileContain of excludeFilesContains) {
      if (item.includes(fileContain)) {
        correctName = false;
        break;
      }
    }

    return correctExtension && correctName;
  });

  return files;
};
