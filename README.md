# File Generator Extension

## Overview

The File Generator extension for Visual Studio Code (VS Code) is a handy tool that allows you to generate files and folders based on a predefined configuration. It simplifies the process of creating project structures and boilerplate files by automating the file generation process.

## Features

- Create files and folders based on a configuration file.
- Define project structures using a simple JSON-based configuration.
- Customize the destination directory for file generation.
- Select configuration preset from the file to generate specific structures.

## Usage

1. **Installation**:

- Install the extension from the VS Code Marketplace.
- Create a JSON configuration file named `filesgen.json` in your project's root directory.

2. **Configuration File**:

- You can use JSON objects, or arrays to define your project's file and folder structure within `filesgen.json`.

You can define your project structure in one of the following ways:

**JSON Array Format**:

```json
["a.ts", "b.ts", "c.ts"]
```

**JSON Object Format**:

```json
{
  "my_preset_name_1":[
     "1.ts",
     {"a":["2.ts","3.ts"]},
     "4.ts"
  ],
  "my_preset_name_2":{
     "b":[],
     "c":"5.ts",
     "d":["6.ts"],
     "e":[
        "7.ts",
        {"f":["8.ts","9.ts"]},
        "10.ts",
        {"g":["11.ts","12.ts"]}
     ]
  }
}
}
```

> Using JSON Object allows you to store multiple presets and select the one you want to use when generating files.

3. **Generate Files**:

- Open a project folder in Visual Studio Code.
- Press `Ctrl+Shift+P` (`Cmd+Shift+P` on MacOs) to open the command palette.
- Search for `"Generate Files"` and select `"FilesGen: Generate Files from JSON"` from the command list.
- Follow the prompts to specify the destination directory and select a configuration preset.
- Files and folders will be generated based on the selected configuration.

## Requirements

<!-- - Visual Studio Code (Version X.X.X or higher) -->

## Extension Settings

<!-- This extension does not have any specific settings. It uses the default VS Code settings. -->

## Known Issues

There are no known issues at the moment. If you encounter any problems, please report them on the [GitHub repository](https://github.com/infected-by-js).

## Release Notes

<!-- - Version 1.0.0
  - Initial release of the FilesGen extension.
- Version 1.1.0
  - Added the ability to customize the destination directory.
  -->
