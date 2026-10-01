# Publishing

pipe0 is listed in Anthropic's directory as two submissions, both made from the developer portal at [claude.ai/directory/manage](https://claude.ai/directory/manage):

1. **MCP connector**: the hosted server `https://api.pipe0.com/v1/mcp`. It gets its own listing, auth configuration, and a per-tool usage dashboard.
2. **Plugin bundle**: this repository. It references the same server URL and adds the `pipe0` skill.

Once both are listed, pair them in the portal. A user who has both sees one set of tools, because both point at the same URL.

Submitting needs a paid Claude plan (Pro, Max, Team, or Enterprise; on Team and Enterprise, an Owner) and your GitHub account connected on claude.ai.

## Release checklist

1. Bump `version` in `.claude-plugin/plugin.json` and add a `CHANGELOG.md` entry with the same version.
2. Run the checks:

   ```bash
   node scripts/validate.mjs
   claude plugin validate .claude-plugin/plugin.json --strict
   claude plugin validate .claude-plugin/marketplace.json --strict
   claude plugin validate skills --strict
   claude plugin eval . --runs 2 --ablation none --no-publish --trust-plugin --max-cost-usd 5
   ```

3. Merge to `main`. The directory follows `main` and picks up the commit through the GitHub push webhook (or its scheduled check), then scans it. A version that passes goes live according to the plugin's publish setting in the portal.

## First submission: MCP connector

Submit the connector first. Its **Tools** step flags any tool without a `title` or a `readOnlyHint`/`destructiveHint`; the server sets all of them (`mcpToolAnnotations` in pipe0 core).

Portal: **Submit new** → **MCP connector**, then:

- **Connection:** `https://api.pipe0.com/v1/mcp`
- **Listing:** name `pipe0`, a one-liner (up to 200 characters), a description (up to 2,000), 1 to 5 categories, docs `https://pipe0.com/docs/sdks/mcp`, privacy policy `https://www.pipe0.com/resources/legal/privacy-policy`, support `https://www.pipe0.com/support`, icon `assets/logo.png`
- **Authentication:** OAuth with dynamic client registration
- **Data handling:** pipe0's own API, which also proxies data providers that pipe0 contracts with
- **Test & launch:** credentials for a reviewer test account with a populated organization (sheets, credits, a connection), plus steps to run each tool
- **Compliance:** all seven acknowledgements

## First submission: plugin bundle

The repository can stay private while you validate and submit: the portal then asks you to agree to a source upload and to install the Claude GitHub App. It must be public before the listing goes live; after making it public, select **Check for new commits**.

Portal: **Submit new** → **Plugin bundle**, then:

- **Source:** repository `pipe-0/claude-plugin`, plugin path empty (the plugin is at the root), branch empty (follows `main`). Select **Validate** and fix every **Blocking** finding.
- **Listing details:** read from `plugin.json` and `README.md`. To change them, edit those files and validate again.
- **Data handling:** reads and stores personal data (B2B contact data); sends data only to its declared connector, `api.pipe0.com`; not intended for people under 18.
- **Compliance:** contact email and the four acknowledgements.
- **Review and submit:** keep **GitHub push webhook**, then **Set up push updates** (needs repository admin).

After publishing, pair the plugin with the connector listing.

## Install without the directory

Claude Code users can install straight from this repository:

```
/plugin marketplace add pipe-0/claude-plugin
/plugin install pipe0@pipe0
```

## Eval baseline (2026-10-01)

Mocked server (`evals/mocks`), 2 runs per case, no baseline arm:

| Case | With the skill | Without the skill (connector only) |
|---|---|---|
| `multi-step-sheet` | 1.00: playbooks, then guide, then `run_effects` | 0.33: listed playbooks, but neither run reached `run_effects` |
| `sign-in` | 1.00 | 0.67: explained `/mcp` sign-in on its own; only `skill-fired` failed |

The mocks have no `_tools.json`, so mocked tools carry placeholder descriptions instead of the real ones. Save a real `tools/list` response to `evals/mocks/pipe0/_tools.json` before trusting the without-skill column.
