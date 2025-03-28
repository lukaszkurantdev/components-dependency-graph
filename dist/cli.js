#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const picocolors_1 = __importDefault(require("picocolors"));
const fs = __importStar(require("node:fs"));
const ComponentGraphAnalyzer_1 = require("./ComponentGraphAnalyzer");
const generateDiagram_1 = require("./src/utils/generateDiagram");
commander_1.program
    .option("-f, --file <path>")
    .option("-d, --directory <path>")
    .option("-c, --config <path>")
    .option("-g, --generate_diagram <path>");
commander_1.program.parse();
const options = commander_1.program.opts();
const DEFAULT_CONFIG_PATH = "cdg.config.json";
const configPath = options.config || DEFAULT_CONFIG_PATH;
let config = {};
try {
    config = JSON.parse(fs.readFileSync(configPath).toString());
}
catch (event) {
    console.log(picocolors_1.default.yellow("Config file not found. Continuing..."));
}
let result = [];
if (options.file) {
    result = (0, ComponentGraphAnalyzer_1.fileBasedAnalyze)(options.file, config);
}
else if (options.directory) {
    result = (0, ComponentGraphAnalyzer_1.directoryBasedAnalyze)(options.directory, config);
}
else {
    console.log(picocolors_1.default.red("Specify file or directory. Check --help for more information."));
}
if (options.generate_diagram) {
    (0, generateDiagram_1.generateGraphVizDiagram)(result, options.generate_diagram);
}
else {
    result.map(item => console.log(item));
}
//# sourceMappingURL=cli.js.map