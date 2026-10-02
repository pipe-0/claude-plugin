---
name: pipe0
description: Use for any pipe0 task, and on any pipe0 connection error. pipe0 finds people and companies, enriches contacts with work emails, phone numbers and LinkedIn data, builds lead lists in pipe0 Sheets, and runs GTM automations such as signals, schedules and CRM syncs. Tells you how to load pipe0's own operating guides and what to do when pipe0 reports needs-auth or 401.
---

# pipe0

The hosted pipe0 MCP server does the work, and it documents itself. This skill only tells you where to read. Do not use it as a substitute for the server's guides.

## Start here

Some clients shorten the instructions the server sends on connect. Before you build anything with more than one step, read the full guides from the server:

1. A multi-step goal, such as a lead list, a signal, or a CRM sync: call `list_playbooks` first. If a playbook fits, call `get_playbook` and follow it.
2. Call `get_guide` with the topic that fits the task: `workflows` for anything multi-step or across sheets, `search`, `enrichment`, `effects` for work on a sheet, or `reports`.
3. Read the `model` guide only when a concept, such as a run status or a record, is unclear.

A single lookup, such as one work email or one company, needs no guide. Run it directly.

## Connected but no tools, needs-auth, or 401

The user has not finished signing in. Stop and tell them how to sign in:

- **Claude Code:** run `/mcp`, select pipe0, and choose Authenticate.
- **Claude app (web, desktop, Cowork):** open Customize, then Connectors, find pipe0, and select Connect.

A browser window opens. They sign in with their pipe0 account and approve access, then ask again.

Do not retry in a loop. Do not fall back to the pipe0 REST API or the docs site to do the task by hand.

## No API keys or tokens

Sign-in is OAuth only. Do not ask for a pipe0 API key, bearer token, or Authorization header, and do not accept one if offered. If a client config already sends one, it fails with 401. Tell the user to remove it and reconnect.
