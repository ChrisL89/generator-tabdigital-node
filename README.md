# Node Project Generator

![Yeoman Logo](yeoman-logo.png)

A generator for [Yeoman](https://yeoman.io). Let Yeoman generate a node project for you!

`generator-tabdigital-node` creates a base template to start a new Tab Digital Node.js project.

## Requirements

+ `nvm`
+ `node`
+ `npm`
+ `yeoman` / `yo`

## Getting Started

Being a Yeoman generator, you'll need to install Yeoman first and foremost!

```shell
$ npm install -g yo
```

### Generator Installation

#### Via Artifactory Registry

Assuming your `npm-local` registry access is setup and ready to go, you should be able to install the generator locally.

To install this generator locally, run the following command:

```shell
$ npm install -g @tabdigital/generator-tabdigital-node
```

#### Via Git - NOT RECOMMENDED

You can clone this repo directly and utilise [npm link](https://docs.npmjs.com/cli/link)

In the top-level dir of your clone:

```shell
$ npm link
```

## Usage

```shell
$ cd /foo/bar/new-project-directory/
$ yo @tabdigital/tabdigital-node
```

**NOTE:** This template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files.

Once complete, your new project will include:

+ Preconfigured `package.json`
+ Preconfigured `.gitignore`, git initialisation incl. `origin` remote.
+ Preconfigured `.nvmrc`, node version management (optional)
+ [ESLint](http://eslint.org/) linting configuration (optional)
+ Tab Digital [Node Dev Seed](https://github.tabcorp.com.au/tabdigital/node-dev-seed) dependency configuration (optional)
+ Preconfigured [meow](https://github.com/sindresorhus/meow) CLI entry point (optional)

## Sub Generators
If you don't need all the features provided by the main generator, you can target specific sub generators directly.

Remember, you can see the options for each by running: `yo @tabdigital/tabdigital-node:TARGETSUBGENERATOR --help`

+ `nvm`
+ `cli`
+ `devseed`
+ `eslint`
+ `git`

## TODO

+ `README.md` sub generator
+ Extend `devseed` generator to include prompts for required services
+ `service` sub generator to add new service in `src/bootstraps` folder
+ `API service` sub generator to add new routes in api service
