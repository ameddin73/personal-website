# Beating GitHub Copilot to the Command Line

### How to build your own AI-powered command line interface

In this article, we will be diving deep into the codebase of an intriguing project called "How", which is a command-line interface (CLI) tool that generates CLI commands and code snippets from natural language inputs. This tool is powered by OpenAI's GPT-3, a state-of-the-art language model. The project is hosted on GitHub and can be found [here](https://github.com/ameddin73/how-ai).

## What is "How"?

"How" is a CLI tool that allows you to generate commands and code snippets by simply describing what you want in natural language. For example, if you want to get the current user, you can type how get current user, and the tool will generate the appropriate command for you. It even supports generating code snippets in various programming languages.

Here are some examples of how you can use the tool:

``` shell
> how get current user
$ whoami copied to clipboard!
```

```shell
> how get the cluster name of every aks cluster that has a nodepool size of 3
$ az aks list --query "[?agentPoolProfiles[?count==\`3\`]].name" copied to clipboard!

```

```java
> how full program to print todays date --code java
//importing the Date class from java.util package which is used to get the current date
import java.util.Date;

public class CurrentDate {
    //Main method
    public static void main(String[] args) {
        //create a Date object
        Date date = new Date();

        //print out current date
        System.out.println(date);
    }
}
```

## Getting Started

To use "How", you first need to install it. You can do this by running the following command:

```shell
npm install -g how-ai
```

Once installed, you can start using "How" by invoking it with a command description. The generated command or code snippet will be copied to your clipboard, and you can then paste it into your terminal or code editor and execute it.

## Building "How" from Scratch

Now that we understand what "How" is and how it works, let's dive into the code and see how we can build a similar tool from scratch. The project structure of "How" is as follows:

```shell
.
├── .github
│   └── workflows
│       ├── main_how-ai-linux-function-app-dev.yml
│       └── release.yaml
├── .gitignore
├── LICENSE
├── README.md
├── how-ai-backend
│   ├── .funcignore
│   ├── HowAI
│   │   ├── function.json
│   │   ├── host.json
│   │   ├── index.ts
│   │   └── src
│   │       ├── api.ts
│   │       ├── config.ts
│   │       └── service.ts
│   ├── host.json
│   ├── package.json
│   └── tsconfig.json
├── how-ai
│   ├── how.js
│   ├── package-lock.json
│   ├── package.json
│   └── src
│       ├── actions.js
│       └── config.js
├── infrastructure
│   ├── .terraform.lock.hcl
│   ├── main.tf
│   ├── providers.tf
│   └── variables.tf
├── package-lock.json
└── package.json
```

The project is divided into three main parts:

1. `how-ai-backend`: This is the server-side code for the "How" tool. It is written in TypeScript and uses the Azure Functions serverless computing service to handle requests. The main dependencies for this part of the project are the @azure/functions and openai packages. The @azure/functions package is used to create Azure Functions, while the openai package is used to interact with the OpenAI API.
The `package.json` file for the backend looks like this:

```json
{
  "name": "how-ai-backend",
  "description": "Server code for how-ai.",
  "main": "HowAI/index.ts",
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "prestart": "npm run build",
    "start": "func start",
    "test": "echo \"No tests yet...\""
  },
  "release": {
    "branches": [
      "main"
    ],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/git"
    ],
    "tagFormat": "server-v${version}"
  },
  "repository": {
    "type": "git",
    "url": "git+<https://github.com/ameddin73/how-ai.git>"
  },
  "author": "Alex Meddin",
  "license": "MIT",
  "bugs": {
    "url": "<https://github.com/ameddin73/how-ai/issues>"
  },
  "homepage": "<https://github.com/ameddin73/how-ai#readme>",
  "dependencies": {
    "@azure/functions": "^3.5.0",
    "openai": "^3.2.1"
  },
  "devDependencies": {
    "@azure/functions": "^3.0.0",
    "@types/node": "^18.15.3",
    "azure-functions-core-tools": "^4.x",
    "typescript": "^4.0.0"
  }
}
```

The scripts section defines several npm scripts that can be used to build and run the project. The build script compiles the TypeScript code to JavaScript using the TypeScript compiler (tsc), the watch script starts the TypeScript compiler in watch mode, and the start script starts the Azure Functions runtime.

The dependencies section lists the packages that the project depends on at runtime, while the devDependencies section lists the packages that are only needed for development.

Let's take a closer look at the server-side code. The entry point for the backend is the HowAI/index.ts file.

The index.ts file is the entry point for the Azure Function that powers the "How" tool. It exports a single asynchronous function that takes a context object and an HTTP request object as parameters. This function is invoked whenever the Azure Function is triggered.

Here is the content of the index.ts file:

```typescript
import { Context, HttpRequest } from "@azure/functions"
import { code, command, setupClient } from "./src/service";
import { CHAT_MODEL, CODE_MODEL } from "./src/config.js";

export default async function(context: Context, req: HttpRequest): Promise<void> {
  if (req.body) {
    console.debug(req.body);
  } else {
    context.res = { status: 400, body: 'No request body.' };
  }

  setupClient();

  const type = req.query.type;
  switch (type) {
    case 'command':
      try {
        const body = await command(req.body.platform, req.body.prompt);
        console.debug('request:', req.body)
        console.debug('response:', body);
        context.res = {
          body
        };
      } catch (error) {
        context.res = { status: 500, error }
      }
      break;
    case 'code':
      try {
        const body = await code(req.body.language, req.body.prompt);
        console.debug('request:', req.body)
        console.debug('response:', body);
        context.res = {
          body
        };
      } catch (error) {
        context.res = { status: 500, error }
      }
      break;
    case 'version':
      context.res = {
        body: {
          chat: CHAT_MODEL,
          code: CODE_MODEL,
        }
      };
      console.debug(context.res)
      break;
    default:
      context.res = { status: 404, body: 'Page not found.' };
      break;
  }
};
```

The function first checks if the request body is present. If not, it responds with a 400 status code and a message indicating that no request body was provided.

Next, it calls the setupClient function to set up the OpenAI client. This function is imported from the service.ts file, which we will look at in more detail later.

The function then checks the type query parameter in the request. If the type is 'command', it calls the command function with the platform and prompt properties from the request body. If the type is 'code', it calls the code function with the language and prompt properties from the request body. Both the command and code functions are asynchronous and return a promise that resolves to the response from the OpenAI API.

If the type is 'version', the function responds with the versions of the chat and code models used by the tool. These versions are imported from the config.js file.

If the type query parameter is not recognized, the function responds with a 404 status code and a 'Page not found.' message.

Let's now take a look at the service.ts file, which contains the setupClient, command, and code functions.

The service.ts file contains the core logic for interacting with the OpenAI API. It exports three functions: setupClient, code, and command.

Here is the content of the service.ts file:

```typescript
import { ApiClient } from './api.js';
import { API_KEY } from './config.js';

var client: ApiClient;

export function setupClient() {
  if (!API_KEY) {
    throw new Error('missing API key')
  }
  client = new ApiClient(API_KEY)
}

export async function code(language: string, prompt: string) {
  if (!client) {
    throw new Error('client not configured')
  }

  // Moderate content
  try {
    const flags = await client.moderate(`${language}. ${prompt}`);
    if (flags) return flags;
  } catch (err) {
    throw err;
  }
  return client.getCode(language, prompt);
}

export async function command(platform: string, prompt: string) {
  if (!client) {
    throw new Error('client not configured')
  }

  // Moderate content
  try {
    const flags = await client.moderate(`${platform}. ${prompt}`);
    if (flags) return {
      flags
    };
  } catch (err) {
    throw err;
  }

  // Get command from OpenAI
  var command = await client.getCommand(platform, prompt);

  // Clean command
  command = extractCode(command);
  return {
    command,
  };
}

function extractCode(sentence: string | undefined) {
  if (!sentence || !sentence.includes("`")) return sentence;
  const regex = /`((?:\\`|[^`])+?)`/;
  const matches = regex.exec(sentence);
  return matches ? matches[1] : "";
}
```

The setupClient function initializes the ApiClient object with the OpenAI API key. This function is called once when the Azure Function starts.

The code and command functions are used to generate code snippets and commands, respectively. Both functions first check if the ApiClient object has been initialized. If not, they throw an error.

Next, they call the moderate method of the ApiClient object to moderate the content of the prompt. If the moderate method returns any flags, the functions return these flags.

If no flags are returned, the code function calls the getCode method of the ApiClient object to generate a code snippet, while the command function calls the getCommand method to generate a command.

The command function also includes a step to clean the generated command. It calls the extractCode function, which extracts the command from the response by looking for text enclosed in backticks (`).

Let's now take a look at the api.ts file, which contains the ApiClient class.

The api.ts file contains the ApiClient class, which is used to interact with the OpenAI API. This class uses the openai package, which is a Node.js client for the OpenAI API.

Here is the content of the api.ts file:

```typescript
import { Configuration, OpenAIApi } from "openai";
import { CHAT_TRAINING, CHAT_MODEL, CODE_MODEL } from "./config.js";

export class ApiClient {
  client: OpenAIApi;

  constructor(apiKey: string) {
    this.client = getClient(apiKey);
  }

  async moderate(content: string): Promise<string | null> {
    try {
      const response = await this.client.createModeration({
        input: content,
      });

      const flags = [];
      if (response.data.results[0].flagged) {
        const categories = response.data.results[0].categories;
        Object.keys(categories).forEach(key => {
          if (categories[key]) flags.push(key);
        });
      }
      console.debug(flags);

      if (flags.length > 0) {
        return `Sorry, that prompt violated the OpenAI usage policies on ${flags}.\n\nRead more here: https://openai.com/policies/usage-policies`;
      }
    } catch (err) {
      throw err;
    }
    return null;
  }

  async getCommand(platform: string, prompt: string) {
    try {
      const response = await this.client.createChatCompletion({
        model: CHAT_MODEL,
        messages: [
          { role: 'system', content: `You respond with terminal commands for ${platform} systems.` },
          ...CHAT_TRAINING,
          {
          role: 'user', content: ${prompt} },
            ],
        max_tokens: 200,
        });

      var command = response.data.choices[0].message?.content;
      command = command?.replace(/[\n\r]/g, "");
      return command
    } catch (err) {
      throw err;
    }
    }

    async getCode(language: string, prompt: string) {
        try {
        const response = await this.client.createCompletion({
            model: CODE_MODEL,
            prompt: `write a code snippet in the programming language ${language} that does the following: ${prompt}.\nInclude code comments that help to explain.`,
            max_tokens: 1000,
            });
          var snippet = response.data.choices[0].text;
          snippet = snippet?.replace(/^\s*\n|\n\s*$/g, "");
          return snippet
        } catch (err) {
          throw err
        }
    }
}

function getClient(apiKey: string) {
    const configuration = new Configuration({ apiKey });
    return new OpenAIApi(configuration);
}
```

The `ApiClient` class has a single property, `client`, which is an instance of the `OpenAIApi` class from the `openai` package. This instance is created in the constructor of the `ApiClient` class, which takes the OpenAI API key as a parameter.

The `ApiClient` class has three methods: `moderate`, `getCommand`, and `getCode`.

The `moderate` method takes a string of content as a parameter and sends it to the OpenAI API for moderation. If the content is flagged by the API, the method returns a message indicating that the content violated the OpenAI usage policies. Otherwise, it returns `null`.

The `getCommand` method takes a platform and a prompt as parameters and sends them to the OpenAI API to generate a command. The command is extracted from the response, cleaned up, and returned.

The `getCode` method works similarly to the `getCommand` method, but it generates a code snippet instead of a command. It takes a programming language and a prompt as parameters and sends them to the OpenAI API. The code snippet is extracted from the response, cleaned up, and returned.

The `getClient` function at the end of the file is a helper function that creates an instance of the `OpenAIApi` class with the given API key.

Now that we have a good understanding of the server-side code, let's move on to the client-side code in the `how-ai` directory. The entry point for the client-side code is the `how.js` file. Let's fetch and analyze this file.

The how.js file is the entry point for the client-side code. It is a Node.js script that uses the commander package to define a command-line interface (CLI) for the "How" tool.

Here is the content of the how.js file:

```javascript
# !/usr/bin/env node --no-warnings

import { program } from 'commander';
import * as actions from './src/actions.js';

program
  .option('-c, --code <language>', 'generate code snippet instead of a command prompt')
  .option('-v, --version', 'print version information about how')

program.parse();
const options = program.opts();
const prompt = program.args.join(' ');

// Check version
await actions.update();

// Print version
if (options.version) {
  try {
    await actions.version();
  } catch (err) {
    console.error(`Error: ${err}`)
    process.exit(1);
  }
  process.exit();
}

if (prompt === '') {
  program.outputHelp();
  process.exit(1);
}

// Execute actions
if (options.code) {
  try {
    await actions.code(options.code, prompt);
  } catch (err) {
    console.error(`Error: ${err}`)
    process.exit(1);
  }
  process.exit();
}

try {
  await actions.command(prompt);
} catch (err) {
  console.error(`Error: ${err}`)
  process.exit(1);
}
```

The script starts by importing the program object from the commander package and the actions object from the actions.js file.

It then defines two options for the CLI: -c, --code <language> and -v, --version. The --code option is used to generate a code snippet in the specified language, while the --version option is used to print version information about the "How" tool.

The script then parses the command-line arguments and extracts the options and the prompt. The prompt is the rest of the command-line arguments joined into a single string.

Next, the script checks the version of the "How" tool by calling the update function from the actions object. If the --version option was provided, it calls the version function to print the version information and then exits.

If no prompt was provided, the script prints the help information for the CLI and exits.

Finally, the script checks if the --code option was provided. If so, it calls the code function with the specified language and the prompt. If not, it calls the command function with the prompt.

Let's now take a look at the actions.js file, which contains the update, version, code, and command functions.

The actions.js file contains the functions that are called when the "How" tool is invoked with different options. These functions interact with the server-side code to generate commands and code snippets.

Here is the content of the actions.js file:

```javascript
import os from 'os';
import axios from 'axios';
import { SERVER_HOST, getVersion, checkForUpdates } from './config.js';
import { copy } from 'copy-paste';

export async function update() {
  return checkForUpdates();
}

export async function version() {
  console.log(`Version: ${getVersion()}`);
  try {
    const models = await axios.get(`${SERVER_HOST}/api/HowAI?type=version`);
    console.log(`Command Model: ${models.data.chat}\nCode Model: ${models.data.code}`);
  } catch (err) {
    throw err;
  }
}

export async function code(language, prompt) {
  try {
    const response = await axios.post(
      `${SERVER_HOST}/api/HowAI?type=code`,
      {
        language,
        prompt
      });
    console.log(response.data);
  } catch (err) {
    throw err;
  }
}

export async function command(prompt) {
  try {
    // Get command from OpenAI
    var response = await axios.post(
      `${SERVER_HOST}/api/HowAI?type=command`,
      {
        platform: os.platform(),
        prompt
      },
    );

    // Check if moderated
    if (response.data.flags) {
      console.error(response.data.flags);
      process.exit(1);
    }
    const command = extractCode(response.data.command);

    copy(command);
    console.log('$ \\x1b[33m%s\\x1b[0m copied to clipboard!', command)
  } catch (err) {
    throw err;
  }
}

function extractCode(sentence) {
  if (!sentence.includes("`")) return sentence;
  const regex = /`((?:\\`|[^`])+?)`/;
  const matches = regex.exec(sentence);
  return matches ? matches[1] : "";
}
```

The update function checks for updates to the "How" tool by calling the checkForUpdates function from the config.js file.

The version function prints the version of the "How" tool and the versions of the chat and code models used by the tool. It gets the version information by sending a GET request to the /api/HowAI?type=version endpoint of the server.

The code function generates a code snippet by sending a POST request to the /api/HowAI?type=code endpoint of the server. The request body contains the programming language and the prompt.

The command function generates a command by sending a POST request to the /api/HowAI?type=command endpoint of the server. The request body contains the platform (obtained using the os.platform function from the os module) and the prompt.

If the response from the server contains any flags, the command function prints these flags and exits. Otherwise, it extracts the command from the response, copies it to the clipboard using the copy function from the copy-paste module, and prints a message indicating that the command has been copied to the clipboard.

The extractCode function is a helper function that extracts the command from the response by looking for text enclosed in backticks (`).

That's it for the client-side code! As you can see, the "How" tool is a relatively simple application that leverages the power of OpenAI's GPT-3 to generate commands and code snippets from natural language inputs. The tool is divided into a server-side component, whichinteracts with the OpenAI API, and a client-side component, which provides a command-line interface for the user.

## Conclusion

In this article, we've taken a deep dive into the "How" tool, a command-line interface that generates commands and code snippets from natural language inputs. We've explored the server-side code, which uses Azure Functions and the OpenAI API, and the client-side code, which provides a command-line interface for the user.

We've seen how the tool uses the power of OpenAI's GPT-3 to understand natural language inputs and generate appropriate commands and code snippets. We've also seen how the tool uses Azure Functions to provide a serverless backend, allowing it to scale to handle any number of requests.

Building a tool like "How" from scratch would involve setting up a serverless backend with Azure Functions, creating an OpenAI API client to interact with the GPT-3 model, and building a command-line interface with Node.js and the commander package. The code for the "How" tool provides a great starting point for anyone interested in building a similar tool.

The "How" tool is a great example of how AI can be used to simplify and automate tasks, making it easier for developers to write code and commands. By leveraging the power of GPT-3, the tool is able to understand natural language inputs and generate accurate and useful outputs, saving developers time and effort.

We hope you've found this deep dive into the "How" tool informative and inspiring. Happy coding!

Find the complete source code for "how-ai" on its [GitHub repository](https://github.com/ameddin73/how-ai), and learn more about this project and others like it on [my website](https://alex-meddin.com/projects#how-ai).
