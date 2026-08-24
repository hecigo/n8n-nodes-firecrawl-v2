# Changelog

## 2.0.0

**Requires n8n >= 1.83.** The node now uses `NodeConnectionTypes.Main` instead of the string
literal `"main"`, as n8n's verification guidelines require. That symbol first shipped in
`n8n-workflow@1.83.0`, so on older n8n this package no longer loads. If you cannot upgrade
n8n, stay on `1.0.17`.

**Your existing workflows keep running unchanged.** Operation values, parameter names and
output shapes are the same. What moved is display only, plus one default worth knowing about.

Two changes you will notice:

- **The `limit` option now defaults to 50** in Crawl, Map and Search, where it used to default
  to 100, 5000 and 5. n8n requires every parameter named `limit` to default to 50. This only
  affects the value prefilled when you newly add the option; workflows that already set it keep
  their value, and workflows that never added it are unaffected. Map and Search now also enforce
  the real API ceilings (100,000 and 100) in the field itself.
- **Option lists are alphabetized and some labels changed.** `Timeout (ms)` reads
  `Timeout (Milliseconds)`, `Max Poll Time (s)` reads `Max Poll Time (Seconds)`. Stored values
  are untouched.

Fixes:

- **Output items now carry `pairedItem`.** Without it n8n could not link an output item back to
  the input item that produced it, so `$('Firecrawl').item` in a downstream node returned the
  wrong item when the node ran on more than one input. This was wrong before and is worth
  re-checking any workflow that relied on it.
- Errors that are not already n8n errors (network failures, timeouts, malformed responses) are
  wrapped in `NodeApiError`, so the HTTP context reaches the UI instead of surfacing as a raw
  throw.
- The node is marked `usableAsTool`, so it can be attached to an AI Agent.
- Light and dark icon variants for the node and for the credential, and the credential now has
  an icon at all.
- `Firecrawl.node.json` (the codex metadata: category and documentation links) is copied into
  `dist` by the build. It had never been shipped, so n8n never read it.

## 1.0.17 and earlier

See the [release history](https://github.com/hecigo/n8n-nodes-firecrawl-v2/releases).
