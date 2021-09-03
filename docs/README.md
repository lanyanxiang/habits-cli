# Habits CLI

?> Author: Jimmy Lan

---

In this article, we will go over some high-level details of this repository. If you are currently reading this document on GitHub, please note that you could [read this documentation on our website](https://lanyanxiang.github.io/habits-cli/) for better experience.

> We will explore:
>
> - [Overview](#overview)
> - [License and Contribution Note](#license-and-contribution-note)
> - [Onboard this Project](#onboard-this-project)
> - [Useful Commands](#commands)
> - [Next Steps](#next-steps)

## Overview

### Purpose
The habits application seeks to help individuals build up healthy habits.

### Background
Based on existing psychological research, one feels more motivated when the reward of keeping healthy habits and completing daily tasks is quantified. Further, one's desire to complete a TODO item might become higher when some randomness of rewards is involved.

### The habits app
The habits application allows individuals to define custom digital properties. Users may use the application to reward themselves with digital properties whenever they achieve goals, complete tasks, etc. Optionally, the user may also deduct some digital assets whenever they perform bad habits. The user may define the exchange rate between digital properties and real-world items.

### The habits CLI
Before I turn this README.md text that you randomly found on GitHub into an academic paper, let's talk about the Habits command-line interface. (Let me assure you, this is not a school project. As we know, I always like to find some weird reasons when I want to code some stuff in my leisure time XD)

The Habits CLI allows one to use the Habits app from the command line (isn't this obvious? :D). It is especially useful for developers or people using their command lines who do not want to switch to a browser or pick up their phone.

Running simple commands such as `habits transaction add` and `habits property update`, individuals can apply rewards to themselves without leaving their comfortable command line window.
The data will be synced across all Habits app clients (e.g., mobile app and web app).


## License and Contribution Note

This repository is released under the GNU General Public License v3.0.
Please find more information in the file named `LICENSE` or `LICENSE.md` in the root repository.

You are always free to use or modify this code in your own project(s), if applicable, as long as you follow the terms and conditions outlined in the `LICENSE` file described above.

It is your responsibility to properly read and understand the terms and conditions from the license file prior to using any part, or parts, of code from this repository.

## Onboard this Project

Are you reading this page on GitHub? Consider viewing the documentation from a website for better experience.
Clone this repository and run `npm run doc` to read the documentation locally on your machine.
Alternatively, you can use the following link: https://lanyanxiang.github.io/habits-cli.

If you don't find the set-up process intuitive enough, please have a look at this [setup guide](setup.md).
Joining or extending a project may be a challenging experience for some.
That's why I aim to provide a good documentation so that you can get up to speed regardless of your prior experience.
Please read some more documentation pages in the documentation site if you require further support.

## Commands

?> You might need to use the commands below extensively throughout your contribution to this project.
Therefore, I strongly encourage you to become familiar with them as soon as possible.

### Set up project

```bash
npm install
```

### Start server

```bash
npm start
```

### Automatic rebuilds

```bash
# TS Node Dev
npm run dev
# TSC Watch
npm run watch-ts
```

### Start documentation site

```bash
npm run doc
```

### Run tests

```bash
# Run test in regular watch mode
npm run test

# Run test and show test coverage
npm run testc
```

Please look at `package.json` for other available scripts.

## Configurations

### Environment variables

A `.env.example` file is provided under the **root directory** to show example environment variables.

However, not all variables are required for the service to run.
You can find a list of required environment variables by looking into the file `src/index.ts`.

Close to the top of the file `src/index.ts`, you will observe an array with the name `requiredVariables`.
This array lists the names of the environment variables that the server depends on.
An error will be thrown, causing the process to halt if one or more of these variables are not defined.

**For example,**

```
> node-authentication-starter@1.0.0 dev
> ts-node-dev src/index.ts

[INFO] 17:24:09 ts-node-dev ver. 1.1.6 (using ts-node ver. 9.1.1, typescript ver. 4.2.2)
17:24:14 [Server] Missing environment Variables: DB_URI, ACCESS_SECRET, REFRESH_SECRET, REDIS_URI
17:24:14 [Server] Process exiting.
```

### dotenv

In development mode, I recommend the use of `dotenv` package.
This template has `dotenv` installed as a development dependency, and variables will be drawn from the `.env` file under **development** mode.

A recommended approach to set up the environment variables is to copy the file `.env.example` and rename the copy `.env`, then start changing the values inside the file based on your project needs.

## Next Steps

Coming soon
