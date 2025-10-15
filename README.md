# ChatGPT Apps SDK Alpic Starter

This repository is a minimal Typescript application demonstrating how to build an OpenAI Apps SDK compatible MCP server with widget rendering in ChatGPT.

## Overview

This project shows how to integrate a Typescript express application with the ChatGPT Apps SDK using the Model Context Protocol (MCP). It includes a working MCP server that exposes tools and resources that can be called from ChatGPT, with responses rendered natively in ChatGPT. It also includes MCP tools without UI widget

## Getting Started

### Prerequisites

- Node.js 22+ (see `.nvmrc` for exact version)
- Ngrok

### Installation

1. Clone the repository:
 
```bash
git clone <repository-url>
cd apps-sdk-template
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Expose local server with ngrok:

```bash
ngrok http 3000
```

Copy the forwarding URL from ngrok.

```bash
Forwarding     https://3785c5ddc4b6.ngrok-free.app -> http://localhost:3000
```

5. Connect to ChatGPT:

- Toggle **Settings → Connectors → Advanced → Developer mode** in the ChatGPT client.
- Navigate to **Settings → Connectors → Create**.
- Enter the URL of your local server (e.g. https://xxxxxx.ngrok-free.app/mcp) and click **Create**. _Don't forget to add `/mcp` to the end of the URL._
- Prompt the model explicitly while you validate the integration. For example, “Can you get me the pokedex entry for pikachu?” Once discovery metadata is dialled in you can rely on indirect prompts.

## Deploy to production

Use Alpic to deploy your OpenAI App to production.

- Fork this repository to your personnal Gihtub organization or use it as a template to create a new project.
- Go to [Alpic](https://app.alpic.ai/), login with your Github account, and create a new project using your repository.
- Leave all default settings and click on **Deploy**. In about 30 seconds you should see your deployment status as **Deployed**
- In ChatGPT, navigate to **Settings → Connectors → Create** and add your MCP server URL with the `/mcp` path (e.g., https://your-app-name.alpic.live/mcp)

## Project Structure

```
.
├── src/
│   ├── app.ts          # OpenAI App extension class with widget API implementation
│   ├── server.ts       # MCP server with tool/resource/prompt registration
│   └── index.ts        # Express server definition
```

## Resources

- [Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Alpic Documentation](https://docs.alpic.ai/)
