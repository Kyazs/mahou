# Git Workflow Reference

Loaded by all magic-pi commands that touch git, via @-include. This is the
single source of truth for branch strategy, commit conventions, merge
strategy, conflict resolution, and initial repository setup.

Distilled from Git Flow, adapted for AI-agent-driven development.

## Branch Strategy (Git Flow)

| Branch | Purpose | Branches from | Merges to |
|---|---|---|---|
| `main` | Production-ready code | — | — |
| `develop` | Integration of completed features | `main` | `main` (via release) |
| `feature/<name>` | New feature development | `develop` | `develop` |
| `release/<version>` | Release preparation | `develop` | `main` + `develop` |
| `hotfix/<name>` | Urgent production fix | `main` | `main` + `develop` |

### Rules

- Never commit directly to `main` or `develop` — always via PR (no-ff merge)
- Feature branches branch from `develop`, merge to `develop`
- Hotfix branches branch from `main`, merge to both `main` and `develop`
- Release branches branch from `develop`, merge to both `main` and `develop`
- Delete the feature/hotfix/release branch after merge

## Branch Naming

- `feature/<name>` — lowercase, hyphenated (e.g., `feature/auth`,
  `feature/product-catalog`)
- `hotfix/<name>` — same convention (e.g., `hotfix/payment-timeout`)
- `release/v<version>` — semantic version (e.g., `release/v1.0`,
  `release/v1.2.0`)
- `main`, `develop` — always lowercase, no prefixes

## Commit Conventions

Conventional Commits with scope. One line, no body, no footer.

### Format

```
<type>(<scope>): <description>
```

### Types

- `feat(<scope>):` — new feature
- `fix(<scope>):` — bug fix
- `test(<scope>):` — test additions/changes
- `refactor(<scope>):` — code restructuring, no behavior change
- `docs(<scope>):` — documentation
- `chore(<scope>):` — tooling, config, dependencies
- `perf(<scope>):` — performance improvement

### Rules

- `<scope>` = feature name from ROADMAP (e.g., `auth`, `catalog`, `payment`)
- If no ROADMAP feature applies, use `core` or the module name
- If a commit spans multiple features, use the primary feature's scope (the
  one the commit most directly relates to)
- One line, no body, no footer — if explanation is needed, it goes in the
  spec or a code comment

### Examples

Good:

```bash
git commit -m "feat(auth): add JWT token refresh"
git commit -m "fix(payment): handle zero-amount edge case"
git commit -m "test(catalog): add product search edge case tests"
```

Bad (no scope):

```bash
git commit -m "feat: add JWT token refresh"
```

Bad (multi-line body):

```bash
git commit -m "feat(auth): add JWT token refresh

This adds a refresh token endpoint that extends sessions.
The token expires after 7 days and can be renewed once."
```

Bad (useless commit, nothing changed):

```bash
git commit -m "chore: verify tests pass"
```

## Merge Strategy

- All merges use `--no-ff` (no fast-forward) to preserve branch topology
- Merge commit message format: `Merge feature/<name> into develop`
  (or `Merge hotfix/<name> into main`, `Merge release/v<version> into main`)
- `magic-ship` creates PRs targeting `develop` for feature branches, `main`
  for hotfix/release branches
- After merge, delete the source branch: `git branch -d feature/<name>`

### PR Target Rules

| Branch | PR targets | After merge |
|---|---|---|
| `feature/<name>` | `develop` | delete feature branch |
| `hotfix/<name>` | `main` | merge to `develop` too, delete hotfix branch |
| `release/<version>` | `main` | merge to `develop` too, delete release branch |

## Conflict Resolution

When a merge or rebase produces conflicts:

1. **Read the conflict markers** (`<<<<<<<`, `=======`, `>>>>>>>`) carefully
2. **Understand what both sides are trying to do** — don't just pick one
3. **If two features conflict**, trace back to the specs to understand intent
4. **Resolve to preserve both intents** if possible; if mutually exclusive,
   ask the user — don't guess
5. **After resolving**: `git add <file>` then `git merge --continue`
   (or `git rebase --continue`)

### Never

- Never abort a merge mid-conflict without telling the user — they need to
  know what was in progress
- Never force-push to `main` or `develop` — force-push only to your own
  feature branch if rebasing
- Never auto-resolve with `--ours` or `--theirs` without understanding both
   sides

## .gitignore Management

The `.magic-pi/` directory contains planning artifacts, not code. It should
be gitignored:

```gitignore
.magic-pi/
```

If `.magic-pi/` is already tracked but should be gitignored, add it to
`.gitignore` and remove from tracking:

```bash
git rm -r --cached .magic-pi/
git commit -m "chore(core): gitignore .magic-pi planning artifacts"
```

## Initial Repository Setup

When initializing a new project (`magic-new-project`), ensure:

1. `main` branch exists — if not, create it: `git checkout -b main`
2. `develop` branch exists — if not, create it from `main`:
   `git checkout -b develop`
3. `.gitignore` includes `.magic-pi/` — add the line if missing
4. User is on `develop` before routing to brainstorm — switch if needed:
   `git checkout develop`

If the repository doesn't exist yet, tell the user to run `git init` first.

If the user doesn't want git, proceed without it — but note that
`magic-ship` (PR creation) won't work without git.
