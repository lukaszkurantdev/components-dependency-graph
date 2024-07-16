export type RawConfig = {
  pathAliases?: Record<string, string>;
  rootPath?: string;
  generateGraphWithFilesPaths?: boolean;
  excludeDirectoriesWithNameContains?: string[];
  excludeFilesContains?: string[];
};

export class GlobalConfig {
  private static instance: Config | undefined;

  static getInstance(rawConfig?: RawConfig) {
    if (!this.instance) {
      this.instance = new Config(
        rawConfig?.pathAliases,
        rawConfig?.rootPath,
        rawConfig?.generateGraphWithFilesPaths,
        rawConfig?.excludeDirectoriesWithNameContains,
        rawConfig?.excludeFilesContains
      );
    }

    return this.instance;
  }

  static clear() {
    this.instance = undefined;
  }
}

export class Config {
  public analyzedFilesMap = new Map<string, boolean>();

  constructor(
    public pathAliases: Record<string, string> = {},
    public rootPath = "",
    public generateGraphWithFilesPath = false,
    public excludeDirectoriesWithNameContains = [] as string[],
    public excludeFilesContains = [] as string[]
  ) {}

  isFileAnalyzed(path: string) {
    return this.analyzedFilesMap.has(path);
  }

  setFileAsAnalyzed(path: string) {
    this.analyzedFilesMap.set(path, true);
  }
}
