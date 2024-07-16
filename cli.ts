#!/usr/bin/env node

import { program } from "commander";
import pc from "picocolors";
import * as fs from "node:fs";
import {
  fileBasedAnalyze,
  directoryBasedAnalyze,
} from "./ComponentGraphAnalyzer";
import { generateGraphVizDiagram } from "./src/utils/generateDiagram";
import { RawConfig } from "./src/types/Config";

program
  .option("-f, --file <path>")
  .option("-d, --directory <path>")
  .option("-c, --config <path>")
  .option("-g, --generate_diagram <path>");

program.parse();

const options = program.opts();
const DEFAULT_CONFIG_PATH = "cdg.config.json";
const configPath = options.config || DEFAULT_CONFIG_PATH;

let config: RawConfig = {};

try {
  config = JSON.parse(fs.readFileSync(configPath).toString());
} catch (event) {
  console.log(pc.yellow("Config file not found. Continuing..."));
}

let result: string[] = [];

if (options.file) {
  result = fileBasedAnalyze(options.file, config);
} else if (options.directory) {
  result = directoryBasedAnalyze(options.directory, config);
} else {
  console.log(
    pc.red("Specify file or directory. Check --help for more information.")
  );
}

if (options.generate_diagram) {
  generateGraphVizDiagram(result, options.generate_diagram);
} else {
  result.map(item => console.log(item));
}
