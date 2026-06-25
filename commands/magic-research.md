---
description: "Internet-connected research — explore, diagnose, or lookup via Yahoo/Bing search"
argument-hint: "[--explore|--diagnose|--lookup] [research question]"
tools:
  read: true
  bash: true
  grep: true
  glob: true
  agent: true
  webfetch: true
---

<objective>
Internet-connected research using Yahoo/Bing search via the native webfetch
tool. Three modes serve different research needs. Heavy fetching happens
inside isolated subagents (for explore/diagnose) to keep main context lean.
Lookup mode fetches directly (1 page, fast, inline).
</objective>

<context>
User's research request: $ARGUMENTS
</context>

<mode_detection>
Parse the first token of $ARGUMENTS:

- `--explore` → broad comparative research (default if no flag given)
- `--diagnose` → narrow deep-dive into a specific issue
- `--lookup` → quick factual lookup, inline return

Everything after the flag is the research question.
</mode_detection>

<process>
### --explore mode (broad, comparative)

1. **Parse the research question** from $ARGUMENTS (strip the --explore flag).
2. **Break the question into 3-5 facets** — independent angles that can be
   researched in parallel. (e.g., "compare Drizzle vs Prisma" → facets:
   "Drizzle features and performance", "Prisma features and performance",
   "migration tooling comparison", "community and ecosystem comparison")
3. **Dispatch 3-5 general subagents in parallel**, one per facet. Use the
   template at `{{MAGIC_PI_HOME}}/references/research-prompt.md`. Each
   subagent:
   - Fetches Yahoo search: `webfetch("https://search.yahoo.com/search?p=<url-encoded-facet>")`
   - Extracts top result URLs from the search results
   - Fetches top 2-3 result pages via webfetch
   - Returns a distilled brief + cited URLs (NOT raw HTML)
4. **Synthesize** the subagent briefs into one research brief.
5. **Generate a UUID** for the brief: `[guid]::NewGuid().ToString()` (PowerShell)
   or `python -c "import uuid; print(uuid.uuid4())"`.
6. **Save** the brief to `./.magic-pi/research/<uuid>.md`.
7. **Return** the brief to the main context (~500-1000 tokens).

### --diagnose mode (narrow, specific)

1. **Parse the specific question** from $ARGUMENTS (strip the --diagnose flag).
2. **Dispatch 1 general subagent** using the template at
   `{{MAGIC_PI_HOME}}/references/research-prompt.md`. If the user provided
   specific URLs to investigate, include them in the subagent prompt.
   The subagent:
   - Fetches Yahoo search or specific URLs provided
   - Deep-dives into 3-5 pages (docs, issues, GitHub, Stack Overflow)
   - Returns a targeted answer + evidence + cited URLs
3. **Generate a UUID** and **save** to `./.magic-pi/research/<uuid>.md`.
4. **Return** the targeted answer to the main context.

### --lookup mode (quick, factual)

1. **Parse the lookup query** from $ARGUMENTS (strip the --lookup flag).
2. **Fetch directly in main context** — no subagent:
   - If the query looks like a URL, fetch it directly:
     `webfetch("<url>")`
   - Otherwise, fetch a Yahoo search:
     `webfetch("https://search.yahoo.com/search?p=<url-encoded-query>")`
   - If searching, extract the top result URL and fetch that page.
3. **Return inline answer** (~100-200 tokens). No file saved.

This mode is for quick factual lookups where a subagent dispatch would be
overhead.
</process>

<token_isolation>
- `--explore` and `--diagnose`: webfetch runs INSIDE subagents (isolated
  context). Main context receives brief only. Raw HTML never enters main
  context.
- `--lookup`: webfetch runs directly in main context. Acceptable because it's
  1 page (~2k tokens), not multiple pages.
- This keeps main context lean regardless of how many pages are fetched.
</token_isolation>

<error_handling>
- **No search results:** Report "no results found for this query." Suggest
  refining the search terms. Do NOT fabricate findings.
- **webfetch fails (timeout, 403, DNS):** Subagent retries once. If still
  failing, notes the failed URL and continues with remaining pages. Returns
  partial results with the failure noted.
- **All fetches fail:** Return "research unavailable: all sources failed to
  load." Save the query to `./.magic-pi/research/<uuid>.md` so the user can
  retry or research manually.
- **Low-quality/irrelevant page:** Subagent notes in brief ("source appeared
  to be SEO spam, excluded from findings") and excludes from results.
</error_handling>

<restrictions>
- Do NOT return raw HTML to the main context. Distill only.
- Do NOT fabricate sources. If you didn't fetch it, don't cite it.
- Fetch caps: explore = 3 pages per subagent, diagnose = 5 pages, lookup = 1
  page.
</restrictions>

<subagent_template>
@{{MAGIC_PI_HOME}}/references/research-prompt.md
</subagent_template>
