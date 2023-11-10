# File Generator Extension

## Overview

The File Generator extension for Visual Studio Code (VS Code) is a handy tool that allows you to generate files and folders based on a predefined configuration.
It simplifies the process of creating project structures and boilerplate files by automating the file generation process.

## Features

- Create files and folders based on a configuration with two mouse clicks.
- Define project structures using a simple JSON-based configuration.
- Customize the destination directory for file generation.
- Select configuration preset from the file to generate specific structures.

## Usage

1. **Installation**:

- Install the extension from the VS Code Marketplace.
- Create a configuration in `settings.json`;

2. **Configuration**:

- Inside `settings.json` add `filesgen.presets`
- As value you can use object, or array to define file and folder structure
- You can define structure in one of the following ways:

**JSON Array Format**:

```json
{
  "filesgen.presets": ["ui.tsx", "utils.ts", "api.ts"]
}
```

**JSON Object Format**:

```json
{
  "filesgen.presets": {
    "my_preset_name_1": [
      "api.ts",
      {
        "ui": ["header.tsx", "content.tsx", "index.ts"]
      },
      "utils.ts"
    ],
    "my_preset_name_2": {
      "helpers": [],
      "api": ["index.ts"],
      "ui": [
        "index.ts",
        {
          "header": ["header-left.tsx", "header-right.tsx"]
        },
        "sidebar.tsx",
        {
          "content": ["banner.tsx", "form.tsx"]
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

![example_right_click](https://github.com/Infected-by-js/filesgen/blob/readme/filesgen_right_click.gif?raw=true)

- Alternatively, you can generate files using the command palette:
  - Press `Ctrl+Shift+P` (`Cmd+Shift+P` on MacOs) to open the command palette.
  - Search for `"Generate Files"` and select `"FilesGen: Generate Files from JSON"` from the command list.
  - Follow the prompts to specify the destination directory and select a configuration preset.

![example_prompt](https://github.com/Infected-by-js/filesgen/blob/readme/filesgen_prompt.gif?raw=true)

Files and folders will be generated based on the selected configuration.

## Known Issues

There are no known issues at the moment. If you encounter any problems, please report them on the [FilesGen](https://github.com/infected-by-js/filesgen).

## Release Notes

- Version 0.0.1
  - Initial release of the FilesGen extension.
- Version 0.0.2
  - Added the ability to customize the destination directory.
- Version 0.0.3
  - Added the overwrite strategy
- Version 0.0.4
  - Minor updates
- Version 0.1.0
  - Release MVP
- Version 0.1.1
  - Update readme description
