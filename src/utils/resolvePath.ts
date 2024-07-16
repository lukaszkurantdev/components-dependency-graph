
import * as path from "node:path";
import * as fs from "node:fs";
import { GlobalConfig } from "../types/Config";
import { EXTENSIONS_TO_ANALYZE } from "../constants/FileExtensions";

export const resolvePath = (filePath: string, parentNodePath: string) => {
  const config = GlobalConfig.getInstance();
  const parentDir = path.dirname(parentNodePath);

  for(const aliasKey of Object.keys(config.pathAliases)) {
    if(filePath.startsWith(aliasKey)) {
      const statementDir = path.dirname(filePath.replace(aliasKey, config.pathAliases[aliasKey]));
     
      return `${config.rootPath}${statementDir}`
    }
  }

  return `${parentDir}/${path.dirname(filePath)}`;
}

export const getFinalPath = (filePath: string, parentNodePath: string) => {
  const fileName = path.basename(filePath);
  const dir = resolvePath(filePath, parentNodePath);

  return findAnalyzeFilePath(fileName, dir)
}

export const findAnalyzeFilePath = (basePath: string, dir: string) => {
  for (const ext of EXTENSIONS_TO_ANALYZE) {
    if (fs.existsSync(`${dir}/${basePath}${ext}`)) {
      return { filePath: `${dir}/${basePath}${ext}`, existsFile: true };
    } else if (fs.existsSync(`${dir}/${basePath}/index${ext}`)) {
      return { filePath: `${dir}/${basePath}/index${ext}`, existsFile: true };
    }
  }

  return { filePath: "", existsFile: false };
};