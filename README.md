# pipe0 Claude plugin

The pipe0 plugin for Claude, Cowork, and Claude Code. The plugin itself lives in [`pipe0/`](pipe0); its [README](pipe0/README.md) is what users see in Anthropic's directory. This root holds the marketplace file, checks, and release docs, and is not part of the plugin.

## Install in Claude Code from this repository

```
/plugin marketplace add pipe-0/claude-plugin
/plugin install pipe0@pipe0
```

Then run `/mcp`, select pipe0, and choose Authenticate.

## Layout

```
.claude-plugin/marketplace.json   Lets Claude Code install the plugin from this repository
pipe0/                            The plugin (the directory's plugin path)
  .claude-plugin/plugin.json      Plugin manifest
  .mcp.json                       Hosted pipe0 MCP server
  skills/pipe0/SKILL.md           Where to read pipe0's guides, and how to handle sign-in
  evals/                          Behavior tests for `claude plugin eval`
  assets/                         Logo
scripts/validate.mjs              Repository checks
PUBLISHING.md                     How releases reach Anthropic's directory
```

## Development

```bash
node scripts/validate.mjs                 # repository checks
claude plugin validate pipe0 --strict     # Claude Code's manifest and MCP checks
claude plugin eval pipe0                  # behavior tests against mocked pipe0 tools
```

See [PUBLISHING.md](PUBLISHING.md) for how releases reach the directory.

## License

MIT
