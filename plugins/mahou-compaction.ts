import type { Plugin } from "@opencode-ai/plugin"

/**
 * mahou compaction persistence plugin.
 *
 * Injects the current .mahou/state.json (orchestration state) into the
 * compaction prompt so that mid-orchestration sessions survive context
 * compaction — the continuation summary knows which task is in progress,
 * what the last known good SHA is, and what concerns were recorded.
 *
 * No .mahou/state.json in the worktree: the hook does nothing.
 */
export const MahouCompaction: Plugin = async ({ worktree, directory }) => {
  const root = worktree ?? directory
  return {
    "experimental.session.compacting": async (input, output) => {
      try {
        const statePath = `${root}/.mahou/state.json`
        const file = Bun.file(statePath)
        if (!(await file.exists())) return
        const state = (await file.text()).trim()
        if (!state || state.length > 8000) return
        output.context.push(
          `## Mahou Orchestration State\nCurrent .mahou/state.json at compaction time:\n${state}\n` +
            `Preserve: the in-progress task, last_known_good_sha, and any concerns so the session can resume orchestration.`,
        )
      } catch {
        /* state.json unreadable — skip, never break compaction */
      }
    },
  }
}
