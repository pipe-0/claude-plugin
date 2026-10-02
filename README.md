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

## Install

**From the directory:** open Customize in Claude, search for **pipe0**, and add the plugin. The first time Claude uses pipe0, sign in with your pipe0 account in the browser and approve access.

**In Claude Code, from this repository:**

```
/plugin marketplace add pipe-0/claude-plugin
/plugin install pipe0@pipe0
```

Then run `/mcp`, select pipe0, and choose Authenticate.

## What Claude can do with pipe0

- **Discover** pipes, searches, effects, and playbooks, and read their exact schemas.
- **Run** one-shot searches and enrichments, or **build sheets** with columns, filters, and schedules.
- **Validate** every payload before anything is billed.
- **Verify** outcomes by reading real cell statuses after a run.
- **Report** with versioned report documents next to your sheets.

Destructive or large runs ask for confirmation first. Read more at [Work with AI agents](https://pipe0.com/docs/sheets/ai-agents).

## Authentication

Sign-in is OAuth 2.1 with PKCE and dynamic client registration. Claude registers itself with pipe0 on first connect and opens the browser for you to sign in and approve access. There is no API key, client ID, or client secret to configure, and the plugin stores no credentials.

## Network endpoints and credentials

The plugin runs no local code. It connects only to `api.pipe0.com`:

| Endpoint | Purpose |
|---|---|
| `https://api.pipe0.com/v1/mcp` | Hosted MCP server (streamable HTTP) |
| `https://api.pipe0.com/.well-known/oauth-protected-resource` | OAuth resource metadata discovery |
| `https://api.pipe0.com/.well-known/oauth-authorization-server` | OAuth server metadata discovery |
| `https://api.pipe0.com/auth/mcp/authorize`, `/token`, `/register` | OAuth 2.1 authorization, token exchange, dynamic client registration |

Credentials: a pipe0 account. The access token is sent as `Authorization: Bearer` on `/v1/mcp` and is scoped to the organization the signed-in user belongs to. Tool calls run on that account and use its credits.

## Privacy and terms

pipe0 processes the data you send through these tools under its [privacy policy](https://www.pipe0.com/resources/legal/privacy-policy) and [terms of service](https://www.pipe0.com/resources/legal/terms-of-service). Support: [pipe0.com/support](https://www.pipe0.com/support).

## What is inside

```
.claude-plugin/plugin.json        Plugin manifest
.claude-plugin/marketplace.json   Lets Claude Code install the plugin from this repository
.mcp.json                         Hosted pipe0 MCP server
skills/pipe0/SKILL.md             Where to read pipe0's guides, and how to handle sign-in
evals/                            Behavior tests for `claude plugin eval`
assets/                           Logo
```

## Development

```bash
node scripts/validate.mjs                 # repository checks
claude plugin validate . --strict         # Claude Code's manifest and MCP checks
claude plugin eval .                      # behavior tests against mocked pipe0 tools
```

See [PUBLISHING.md](PUBLISHING.md) for how releases reach the directory.

## License

MIT. Use of the hosted MCP server is governed by pipe0's [terms of service](https://www.pipe0.com/resources/legal/terms-of-service).
