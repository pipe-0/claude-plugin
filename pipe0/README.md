# pipe0 for Claude

![pipe0](assets/logo.png)

[pipe0](https://pipe0.com) gives your agent GTM data: verified emails, phone numbers, firmographics, and more. Build targeted lead lists and enrich them from dozens of providers, all from chat.

Then keep them working:

- **Watch for signals:** job changes, funding and company news, new hires, email replies, booked meetings, and custom webhook events.
- **Act automatically:** enrich, score, and route each lead to HubSpot, Salesforce, Attio, or Slack.
- **Keep everything in one place:** save lists to pipe0 sheets, schedule recurring runs, and pick up where you left off in any chat.

The plugin has two parts:

- **The hosted pipe0 MCP server.** It exposes the whole product as tools and carries its own operating instructions, guides, and playbooks.
- **One skill, `pipe0`.** It tells Claude where to read those guides before a multi-step task, and how to handle sign-in. It does not copy the guides, so the plugin never falls out of date with the server.

## Get started

Open Customize in Claude, search for **pipe0**, and add the plugin. The first time Claude uses pipe0, sign in with your pipe0 account in the browser and approve access.

In Claude Code, run `/mcp`, select pipe0, and choose Authenticate.

## What Claude can do with pipe0

- **Discover** pipes, searches, effects, and playbooks, and read their exact schemas.
- **Run** one-shot searches and enrichments, or **build sheets** with columns, filters, and schedules.
- **Validate** every payload before anything is billed.
- **Verify** outcomes by reading real cell statuses after a run.
- **Report** with versioned report documents next to your sheets.

Destructive or large runs ask for confirmation first. Read more at [Work with AI agents](https://pipe0.com/docs/sheets/ai-agents).

## Authentication

Sign-in is OAuth 2.1 with PKCE and dynamic client registration. Claude registers itself with pipe0 on first connect and opens the browser for you to sign in and approve access. There is nothing to configure, and the plugin stores nothing on your machine.

## Network endpoints

The plugin runs no local code. It connects only to `api.pipe0.com`:

| Endpoint | Purpose |
|---|---|
| `https://api.pipe0.com/v1/mcp` | Hosted MCP server (streamable HTTP) |
| `https://api.pipe0.com/.well-known/oauth-protected-resource` | OAuth resource metadata discovery |
| `https://api.pipe0.com/.well-known/oauth-authorization-server` | OAuth server metadata discovery |
| `https://api.pipe0.com/auth/mcp/authorize`, `/token`, `/register` | OAuth 2.1 authorization and client registration |

Access is scoped to the pipe0 organization of the signed-in user. Tool calls run on that account and use its credits.

## Privacy and terms

pipe0 processes the data you send through these tools under its [privacy policy](https://www.pipe0.com/resources/legal/privacy-policy) and [terms of service](https://www.pipe0.com/resources/legal/terms-of-service). Support: [pipe0.com/support](https://www.pipe0.com/support).

## License

MIT. Use of the hosted MCP server is governed by pipe0's [terms of service](https://www.pipe0.com/resources/legal/terms-of-service).
