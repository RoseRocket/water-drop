# water-drop [![Build Status](https://travis-ci.org/anvk/water-drop.svg?branch=master)](https://travis-ci.org/anvk/water-drop)

> 💧 very easy to use multi-language scaffolding/boilerplate tool for creating code within your existing projects

## Idea
A growing big project might eventually require developers to start creating boilerplates or code templates for new modules they create. Those code templates are most likely a copy-paste code following by some code alterations which are basic renamings. `water-drop` is a scaffolding/boilerplate tool which allows to create those new modules based on the existing templates provided by develoeprs. This tool was created with an idea to satisfy the following conditions:

1. It has to work for multiple languages (Go, JavaScript, Python, etc)
2. It has to be **easy** to use. Nobody should go through pages of documentation or reading lines and lines of code in order to understand how this tool works.
3. It has to be **easy** to write new templates. (`Handlebars` are used as the main templating engine to apply all renamings)

Here is the list of the basic instructions required in case of an over simplified basic case when you need to create a new module based on your boilerplate which consist of just a single file.

1. **Type** type of the template to be used for a new module
1. **Name**
2. **Path** relative path where new module will reside inside of a bigger project code base
3. **Content** (possibly with ability to do some changes based on the module name)

## Installation

Global installation *(suggested)*
```
$ npm i -g water-drop
$ water-drop
```

Local installation
```
$ npm install water-drop
$ node_modules/.bin/water-drop
```

## Available Commands

To init `water-drop` inside the folder. This command will generate a basic config file (`water-drop.json`) required for `water-drop` execution as well as a basic folder structure (`water-drop-templates`) to support the config.
```
$ water-drop --init
```

To find available commands as well as how to use this command line tool
```
$ water-drop -h
```

To list all available templates
```
$ water-drop --list
```

To generate a new module with name `new_module_name` based on the template `new_module_type` with the template path `new_module_path` within the project you specified inside `water-drop.json` file. (-v is for extra verbosity)
```
$ water-drop [-v] -t <new_module_type> -n <new_module_name> -p <new_module_path>
```

## Quick Start

The following command has to be run inside the folder where module templates will be stored

```
$ water-drop --init
```

This command will create `water-drop.json` with the config for your templates and `water-drop-templates` folder which will contain all files required for the templates described in configuration file.

A basic configuration will be generated. This configuration will contain an example template with 2 steps for module scaffolding.

```json
{
    "templates": {
        "example": {
            "steps": [
                { "cmd": "mkdir", "path": "{{projectPath}}/{{lcase _mName}}/{{_mPath}}" },
                {
                    "cmd": "cpf",
                    "what": "example.js",
                    "to": "{{projectPath}}/{{lcase _mName}}/{{_mPath}}/example.js"
                }
            ],

            "vars": {}
        }
    },
    "vars": {
        "projectPath": "../"
    },
    "_tFolder": "water-drop-templates",
    "_tOpenTag": "<%%",
    "_tCloseTag": "%%>"
}
```

An example template file `water-drop-templates/example/example.js` will be generated as well

```js
const {{u_case_all _mName}}_CONST = 'Hello from water-drop !';

function {{lcase _mName}}Func(arg) {
    console.log({{u_case_all _mName}}_CONST);
}

export default {{lcase _mName}}Func;
```

Run the following command to scaffold a new module

```
$ water-drop -t example -n MyModule -p /path
```

It will create `myModule/path/index.js` one folder up from where your `water-drop.json` is located (since steps use an example `projectPath` variable. This variable is not required. You can define and use any other variables)

Feel free to modify config file and create template files within `water-drop-templates` to fit your project needs.

## Steps

### mkdir

```json
{ "cmd": "mkdir", "path": "some/folder/structure" }
```

Will create a folder with a specified `path` relative to the folder where `water-drop` is executed. (You cand use `Handlebars` templating for the `path` property as shown in the auto-generated example)

### cp

```json
{
    "cmd": "cp",
    "what": "file1.txt",
    "to": "some/folder/structure/file1.txt"
},
```

Will copy and rename the file with the full path specified in `what` property within the `water-drop-templates/<new_module_name>` folder. The file will be copied to `to` property relative to the folder where `water-drop` is executed. (You cand use `Handlebars` templating for the `to` property as shown in the auto-generated example)

### cpf
```json
{
    "cmd": "cpf",
    "what": "file1.txt",
    "to": "some/folder/structure/file1.txt"
},
```

This command will apply `Handlebars` templating to the content of the copied file.
Will copy and rename the file with the full path specified in `what` property within the `water-drop-templates/<new_module_name>` folder. The file will be copied to `to` property relative to the folder where `water-drop` is executed. (You cand use `Handlebars` templating for the `to` property as shown in the auto-generated example)

## Available (extra) Handlebar Helpers

- **ucase** (Applies `toUpperCase()` to the first character. E.g. myModule -> MyModule)
- **lcase** (Applies `toLowerCase()` to the first character. E.g. MyModule -> myModule)
- **ucaseall** (Applies `toUpperCase()` to all characters. E.g. myModule -> MYMODULE)
- **lcaseall** (Applies `toLowerCase()` to all characters. E.g. MyModule -> mymodule)
- **u_case_all** (Applies `toUpperCase()` to all characters and inserts '_' in between. E.g. MyModule -> MY_MODULE)
- **l_case_all** (Applies `toLowerCase()` to all characters and inserts '_' in between. E.g. MyModule -> my_module)

## Context

Everytime a context is passed into `Handlebars` templating function. Each template will have the following context variables:

- All variables within **vars** property of the config withijn `water-drop.json` file
- All variables within **vars** property of the template configuration within `water-drop.json` file
- **_mType** - template type used to create new module (passed through CLI)
- **_mName** - new module name (passed through CLI)
- **_mPath** - path to the new module (passed through CLI)

Also some specific to `water-drop` configuration such as:

- **_tFolder** - location of the folder with template files
- **_tOpenTag** - special open tag to be used for `cpf` command
- **_tCloseTag** - special close tag to be used for `cpf` command

## Limitation

Please use `_tOpenTag` and `_tCloseTag` tags in order to preserve `{{` and `}}` in your new module code (By default those values are `<%%` and `%%>` respectively).
So if your code `style=<%% weight: 50px, height: 50px %%>` will be translated to `style={{ weight: 50px, height: 50px }}`.

## Things to Implement

1. There are no tests for this project yet.
2. We need to add a step command which will be able to inject a line of code into another existing file in a smart way.
3. Roll-back mechanism in case when command fails to hanging files.
4. Ability to pre-parse and detect issues with step configuration prior to actual execution.
5. More detailed logging would be great in order to identify a problem when command fails.

## License

MIT license; see [LICENSE](./LICENSE).

(c) 2017 by Alexey Novak
