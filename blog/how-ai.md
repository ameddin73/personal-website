# How-AI: Generate CLI Commands and Code Snippets from Natural Language

In this tutorial, we will walk through the process of creating and deploying How-AI, a command-line application that leverages the power of OpenAI's GPT-3 to generate CLI commands and code snippets from natural language. By the end of this tutorial, you will be able to create the How-AI app and understand its underlying code and infrastructure.

## Table of Contents

1. Introduction
2. Project Overview
3. Setting Up the Project
4. Backend
5. Infrastructure
6. Deployment
7. Conclusion

## 1. Introduction

The How-AI app allows users to generate CLI commands and code snippets by providing a natural language description. Powered by OpenAI's GPT-3, How-AI can help users with complex queries or provide a library of hard-to-memorize commands.

## 2. Project Overview

How-AI consists of the following components:

- Backend: An Azure Function written in TypeScript that serves as the bridge between the OpenAI API and the command-line application.
- Infrastructure: Terraform scripts to set up and manage the required Azure resources.
- Command-Line Application: A Node.js CLI tool that sends user input to the backend and returns the generated command or code snippet.

## 3. Setting Up the Project

To set up the project, you will need Node.js, npm, and the Azure CLI installed on your system. You will also need an OpenAI API key and an Azure subscription.

Clone the How-AI repository and install the required dependencies:

```
git clone https://github.com/your_username/how-ai.git
cd how-ai
npm install
```

## 4. Developing the Backend

The backend is responsible for processing user input, interacting with the OpenAI API, and returning the generated commands or code snippets. In this section, we'll guide you through the step-by-step process of writing the backend code from scratch.

### 4.1. Setting up the project

First, create a new directory named `how-ai-backend` and navigate to it:

```bash
mkdir how-ai-backend
cd how-ai-backend
```

Initialize a new Node.js project:

```bash
npm init -y
```

Install the required dependencies:

```bash
npm install axios commander openai
```

<!-- TODO this is out of order -->
## 5. Creating a New Azure Function Template Locally with the Azure CLI

In this section, we will walk you through the process of creating a new Azure Function template on your computer using the Azure CLI and the Azure Functions Core Tools.

### 5.1. Install the Azure Functions Core Tools

Before you begin, make sure you have the Azure Functions Core Tools installed on your system. If you don't have it installed, you can follow the installation instructions provided in the [official documentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cbash#install-the-azure-functions-core-tools).

### 5.2. Create a new Function App project

To create a new Azure Function App project on your computer, run the following command:

```bash
func init how-ai-backend --typescript
```

Replace `<ProjectName>` with the desired name for your project and `<Runtime>` with the desired runtime for your application, such as `node`, `python`, or `dotnet`.

This command will create a new directory named `<ProjectName>` containing a basic function app project with the specified runtime.

### 5.3. Navigate to the project directory

Change your current working directory to the newly created project directory:

```bash
cd <ProjectName>
```

### 5.4. Create a new function

To create a new function within the project, run the following command:

```bash
func new --name <FunctionName> --template <Template>
```

Replace `<FunctionName>` with the desired name for your function and `<Template>` with the desired template for your function, such as `HttpTrigger`, `TimerTrigger`, or `BlobTrigger`.

This command will create a new directory named `<FunctionName>` within your project containing a basic function implementation based on the specified template.

### 5.5. Test your function locally

Before deploying your function to Azure, you can test it locally using the Azure Functions Core Tools. Start your function app by running the following command:

```bash
func start
```

This command will start your function app locally, allowing you to test your functions by sending HTTP requests to the local endpoints.

### 5.6. Deploy your function to Azure

Once you're satisfied with the functionality of your Azure Function, you can follow the steps mentioned in the previous answer to deploy your function to Azure using the Azure CLI.

In this section, we walked you through the process of creating a new Azure Function template on your computer using the Azure CLI and the Azure Functions Core Tools. With this knowledge, you can create and test your functions locally before deploying them to Azure.

### 4.2. Creating the API client

Create a new file named `api.js` inside the `how-ai-backend` directory. This file will contain the `ApiClient` class responsible for making requests to the OpenAI API.

In `api.js`, start by importing the necessary modules:

```javascript
const axios = require("axios");
const { API_KEY } = require("./config");
```

Next, create the `ApiClient` class:

```javascript
class ApiClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: "https://api.openai.com/v1",
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
  }
}
```

Now, add the `moderate()` method to the `ApiClient` class. This method will be responsible for moderating the content:

```javascript
async moderate(prompt) {
  // TODO: Implement content moderation
}
```

Finally, implement the `getCode()` and `getCommand()` methods for generating code snippets and CLI commands, respectively:

```javascript
async getCode(language, prompt) {
  // TODO: Implement code generation
}

async getCommand(platform, prompt) {
  // TODO: Implement command generation
}
```

Export the `ApiClient` class at the end of the file:

```javascript
module.exports = { ApiClient };
```

### 4.3. Implementing content moderation, code generation, and command generation

For each of the three methods (`moderate()`, `getCode()`, and `getCommand()`), we'll need to make requests to the OpenAI API. We'll use the `axios` library to make these requests.

Start by implementing the `moderate()` method:

```javascript
async moderate(prompt) {
  const response = await this.client.post("/davinci-codex/completions", {
    prompt: `Moderate the following content: ${prompt}`,
    max_tokens: 5,
    n: 1,
    stop: null,
    temperature: 0,
  });

  const result = response.data.choices[0].text.trim();
  if (result === "Safe") {
    return null;
  } else {
    return { flags: ["unsafe"] };
  }
}
```

Next, implement the `getCode()` method:

```javascript
async getCode(language, prompt) {
  const response = await this.client.post("/davinci-codex/completions", {
    prompt: `${language}. ${prompt}`,
    max_tokens: 50,
    n: 1,
    stop: null,
    temperature: 0.5,
  });

  return response.data.choices[0].text.trim();
}
```

Finally, implement the `getCommand()` method:

```javascript
async getCommand(platform, prompt) {
  const response = await this.client.post("/davinci-codex/completions", {
    prompt: `Generate a ${platform} command to ${prompt}`,
    max_tokens: 50,
    n: 1,
    stop: null
```

## 5. Infrastructure

The infrastructure for How-AI is managed using Terraform. Terraform scripts are used to set up and manage the required Azure resources, such as the Azure Function, storage account, and key vault.

### 5.1. Understanding the Infrastructure Code

The `main.tf` file contains the Terraform configuration for the infrastructure. It defines the required resources, such as the resource group, storage account, and Azure Function.

Here's a high-level overview of the resources defined in `main.tf`:

- **Resource Group**: A logical container for resources deployed within an Azure subscription.
- **Storage Account**: Provides storage services for the Azure Function.
- **Service Plan**: Defines the pricing tier and features for the Azure Function.
- **User Assigned Identity**: An Azure Active Directory identity that can be assigned to resources like the Azure Function.
- **Key Vault**: A centralized storage for application secrets, such as API keys and connection strings.

- **Role Assignment**: Assigns a role to the User Assigned Identity, granting it access to the Key Vault.
- **Application Insights**: Provides monitoring and diagnostics for the Azure Function.
- **Linux Function App**: The Azure Function itself, configured to run on a Linux-based environment.

## 6. Deployment

Once you have the backend and infrastructure set up, it's time to deploy the How-AI app to Azure.

### 6.1. Deploying the Infrastructure

First, navigate to the `infrastructure` directory and initialize Terraform:

```

cd infrastructure
terraform init

```

Next, apply the Terraform configuration to create the required resources in Azure:

```

terraform apply

```

After the resources are created, Terraform will output the Azure Function URL, which you'll need in the next step.

### 6.2. Deploying the Backend

To deploy the backend to the Azure Function, run the following command from the project root directory:

```

func azure functionapp publish <function_app_name>

```

Replace `<function_app_name>` with the name of the Azure Function created in the previous step.

### 6.3. Configuring the Command-Line Application

Now that the backend is deployed, update the command-line application's configuration to use the Azure Function URL. In the `config.js` file, set the `FUNCTION_URL` variable to the URL output by Terraform.

Finally, install the command-line application globally using npm:

```

npm install -g

```

## 7. Conclusion

Congratulations! You have successfully created and deployed the How-AI app. You can now generate CLI commands and code snippets using natural language right in your terminal.

To use How-AI, simply run `how` followed by a natural language description of the command or code snippet you want. For example:

```

how get current user

```

Or to generate code snippets:

```

how -c python small function to initialize tensorflow

```

Remember, How-AI is powered by OpenAI's GPT-3, which is a generative language model and may produce incorrect or invalid responses. Always use your judgment and refer to documentation when using the generated commands or code snippets.

We hope you find How-AI useful and enjoy using it as much as we enjoyed building it!
