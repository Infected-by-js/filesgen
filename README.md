# File Generator Extension

## Overview

The File Generator extension for Visual Studio Code (VS Code) is a handy tool that allows you to generate files and folders based on a predefined configuration.
It simplifies the process of creating project structures and boilerplate files by automating the file generation process.

## Features

- Create files and folders based on a configuration file.
- Define project structures using a simple JSON-based configuration.
- Customize the destination directory for file generation.
- Select configuration preset from the file to generate specific structures.

## Usage

1. **Installation**:

- Install the extension from the VS Code Marketplace.
- Create a configuration in `settings.json`;

2. **Configuration**:

- Inside `settings.json` add `filesgen.config` key
- As value you can use object, or array to define file and folder structure

You can define structure in one of the following ways:

**JSON Array Format**:

```json
{
  "filesgen.config": ["a.ts", "b.ts", "c.ts"]
}
```

**JSON Object Format**:

```json
{
  "filesgen.config": {
    "my_preset_name_1": [
      "1.ts",
      {
        "a": ["2.ts", "3.ts"]
      },
      "4.ts"
    ],
    "my_preset_name_2": {
      "b": [],
      "c": "5.ts",
      "d": ["6.ts"],
      "e": [
        "7.ts",
        {
          "f": ["8.ts", "9.ts"]
        },
        "10.ts",
        {
          "g": ["11.ts", "12.ts"]
        }
      ]
    }
  }
}
```

> Using Object allows you to store multiple presets and select the one you want to use when generating files.

3. **Generate Files**:

- To generate files using the mouse:
  - Right-click on a specific folder or directory within the project explorer.
  - Choose `"Generate Files from JSON"` from the context menu.
- Alternatively, you can generate files using the command palette:
  - Press `Ctrl+Shift+P` (`Cmd+Shift+P` on MacOs) to open the command palette.
  - Search for `"Generate Files"` and select `"FilesGen: Generate Files from JSON"` from the command list.
  - Follow the prompts to specify the destination directory and select a configuration preset.
  - Files and folders will be generated based on the selected configuration.

## Extension Settings

<!-- This extension does not have any specific settings. It uses the default VS Code settings. -->

## Known Issues

There are no known issues at the moment. If you encounter any problems, please report them on the [FilesGen](https://github.com/infected-by-js/filesgen).

## Release Notes

- Version 0.0.1
  - Initial release of the FilesGen extension.
- Version 0.0.2
  - Added the ability to customize the destination directory.
