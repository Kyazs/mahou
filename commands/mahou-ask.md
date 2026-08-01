---
description: "Answer questions and explain code without making changes (read-only)"
argument-hint: "[question or code to explain]"
agent: ask
subtask: true
model: opencode-go/deepseek-v4-flash
---

<objective>
Answer questions and explain code. Do not make any changes. This command runs
as a subagent with tool-enforced read-only (the `ask` agent denies `edit`/
`write` and mutating bash), so your main session's context stays clean.
</objective>

<rules>
- Read the relevant code carefully and explain it clearly.
- Quote specific lines and file paths when referencing code.
- Be concise but complete. Prefer concrete examples over abstractions.
- If the user's question is ambiguous, ask for clarification before answering.
- If the user asks you to make changes, tell them to run `/mahou-debug`,
  `/mahou-brainstorm`, or use the build agent to implement.
- Use `grep` and `glob` to find relevant code. Use `read` to examine files.
- Use `bash` only for read-only inspection (ls, cat, git log, git diff, find).
</rules>

<context>
User's question: $ARGUMENTS
</context>

<process>
Answer the question directly. No multi-phase process needed -- this is a
straightforward read-and-explain command.
</process>
