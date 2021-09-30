# Project Setup Guide

?> Author: Jimmy Lan

---

> In this article, we will discuss ways to run the Habits CLI locally **during development** process.

## Install dependencies

After cloning this repository, run
```bash
npm install
```
to install all project dependencies.

## Compile and run CLI using ts-node

A convenient script is provided to compile and run habits CLI using `ts-node/register`. This script is located in the `bin` folder and is called `habits-dev`.

For example, **from the root** of this repository, you can run:
```bash
./bin/habits-dev <...>
```
to **compile** and **start** the habits CLI.
Note that this command may be slow on some machines, because the command will first compile the TypeScript code before starting the program.

## Build and run CLI using tsc

Alternatively, you may run

```bash
npm run build
```

and follow by

```bash
./bin/habits <...>
```

This will compile the program using `tsc`, then run the JavaScript files from the `dist` output folder.
Note that with this approach, you need to recompile the scripts manually using `npm run build` whenever you make a code change.
