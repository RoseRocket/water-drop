# water-drop [![Build Status](https://travis-ci.org/anvk/water-drop.svg?branch=master)](https://travis-ci.org/anvk/water-drop)

> 💧 very easy to use multi-language scaffolding/boilerplate tool for creating code within your existing projects

## Idea
After working on a big project you might find that developers started to create boilerplates or code templates. Those code templates are being copy-pasted into a proper path into the project following by renaming some code here and there. Hence we decided to create a scaffolding/boilerplate tool which must satisfy the following conditions:

1. It has to work for multiple languages
2. It has to be **easy** to use. Nobody should go through pages of documentation or code to understand how it works.
3. It has to be **easy** to write new templates. (Hence we have decided to use `Handlebars` as the main templating engine)

In the over-simplified basic case when you need to create a new module based on your boilerplate which consist of just a single file, your new module must consist of the following items:

1. **Name**
2. **Path** where it resides within a bigger code base
3. **Content** (which might be altered by renaming some of the code chunks)

## Installation

Global installation (suggested)
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

To init `water-drop` inside the folder. It will generate basic config file required for `water-drop` execution and a basic file structure to support the config. Remember that `water-drop` command must be executed from the same folder where `water-drop.json` file is located.
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

To generate a new module with name `template_name` based on the template `template_type` with the template path `template_path` within the project you specified inside `water-drop.json` file. (-v is for extra verbosity)
```
$ water-drop [-v] -t <template_type> -n <template_name> -p <path>
```

## Quick Start

Run the following command within any folder where you want your module templates to reside

```
$ water-drop --init
```

This command will create `water-drop.json` with the config for your templates and `water-drop-templates` folder which will contain all files required for the templates described in configuration file.

A basic configuration will be generated. Even without much coding knowledge you could possibly get an idea what this config does.

```json
{
    "templates": {
        "example": {
            "steps": [
                { "cmd": "mkdir", "path": "{{projectPath}}/{{lcase _tName}}/{{_tPath}}" },
                {
                    "cmd": "cpf",
                    "what": "example.js",
                    "to": "{{projectPath}}/{{lcase _tName}}/{{_tPath}}/example.js"
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

With an example file `water-drop-templates/example/example.js`

```js
const {{u_case_all _tName}}_CONST = 'Hello from water-drop !';

function {{lcase _tName}}Func(arg) {
    console.log({{u_case_all _tName}}_CONST);
}

export default {{lcase _tName}}Func;
```

Now if you run

```
$ water-drop -t example -n MyModule -p /path
```

It will create `myModule/path/index.js` one folder up from where your `water-drop.json` is located.

You can start modifying this config by adding extra steps or adding extra templates to this configuration.

## Steps

### mkdir

```json
{ "cmd": "mkdir", "path": "some/folder/structure" }
```

Will create a folder structure with the `path` relative to the folder where `water-drop` is executed. You cand use `Handlebars` templating for the `path` property.

### cp

```json
{
    "cmd": "cp",
    "what": "file1.txt",
    "to": "some/folder/structure/file1.txt"
},
```

Will copy and rename the file. `what` property tells where to find the file within the `water-drop-templates/<template_name>`. `to` is the path relative to the folder where `water-drop` is executed.

### cpf
```json
{
    "cmd": "cpf",
    "what": "file1.txt",
    "to": "some/folder/structure/file1.txt"
},
```

Will copy and rename the file. `what` property tells where to find the file within the `water-drop-templates/<template_name>`. `to` is the path relative to the folder where `water-drop` is executed.
However this command will apply `Handlebars` templating within the file.

## Available (extra) Handlebar Helpers

- **ucase** (Applies `toUpperCase()` to the first character. E.g. myModule -> MyModule)
- **lcase** (Applies `toLowerCase()` to the first character. E.g. MyModule -> myModule)
- **ucaseall** (Applies `toUpperCase()` to all characters. E.g. myModule -> MYMODULE)
- **lcaseall** (Applies `toLowerCase()` to all characters. E.g. MyModule -> mymodule)
- **u_case_all** (Applies `toUpperCase()` to all characters and inserts '_' in between. E.g. MyModule -> MY_MODULE)
- **l_case_all** (Applies `toLowerCase()` to all characters and inserts '_' in between. E.g. MyModule -> my_module)

## Context

Everytime a context is passed into `Handlebars` templating function. Each template will have the following context object:

- All variables within **vars** property of the config withijn `water-drop.json` file
- All variables within **vars** property of the template configuration within `water-drop.json` file
- **_tType** - type of the template (passed through CLI)
- **_tName** - name of the new module (passed through CLI)
- **_tPath** - path to the new module (passed through CLI)

Also some specific to `water-drop` configuration such as:

- **_tFolder** - location of the folder with template files
- **_tOpenTag** - special open tag to be used for `cpf` command
- **_tCloseTag** - special close tag to be used for `cpf` command

## Things to Implement

1. There are no tests for this project yet.
2. We need to add a step command which will be able to inject a line of code into another existing file in a smart way.
3. Roll-back mechanism in case when command fails to hanging files.
4. Ability to pre-parse and detect issues with step configuration prior to actual execution.
5. More detailed logging would be great in order to identify a problem when command fails.

## License

MIT license; see [LICENSE](./LICENSE).

(c) 2017 by Alexey Novak
