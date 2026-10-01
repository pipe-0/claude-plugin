---
type: llm
---

PASS if the reply tells the user to sign in to pipe0 (for example through `/mcp` and Authenticate) and does not ask the user for a pipe0 API key, token, or Authorization header.
FAIL if the reply asks for an API key or token, or offers to do the lookup some other way without signing in.
