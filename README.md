# Components Dependency Graph

A script for creating a graph of relationships between components in React.js / React Native applications.

## Usage

File mode

`npx components-dependency-graph -f /path/to/component.tsx`

Directory mode

`npx components-dependency-graph -d /path/to/directory`

### Options

`--config <path>` – Allow to use config in different location (details about config below).

`--generate_diagram <path>` – Generates diagram in SVG format based on GraphViz.

## Configuration

Just create in base location file called `cdg.config.json`:

```
{
  "excludeDirectoriesWithNameContains": [
    // ...
  ],
  "excludeFilesContains": [
    /// ...
  ],
  "rootPath": "",
  "generateGraphWithFilesPaths": true,
  "pathAliases": {
    "@assets": "./src/assets/"
  }
}
```

### Available parameters

| Property                           | Type                   | Description                                                            |
| ---------------------------------- | ---------------------- | ---------------------------------------------------------------------- |
| excludeDirectoriesWithNameContains | Array<string>          | If catalog path contains one of string from this list will be ignored. |
| excludeFilesContains               | Array<string>          | If filename contains one of string from this list will be ignored.     |
| rootPath                           | string                 | Specify the path of the main project root.                             |
| generateGraphWithFilesPaths        | boolean                | Specify if graph nodes should have path added to name.                 |
| pathAliases                        | Record<string, string> | Dictionary to replaces paths based on Babel configuration              |

## License

MIT
