# Database Schema Guidelines

This document describes database schema design guidelines for SparkCrew. It does not create migrations, SQL, or ORM models.

## Principles

- Keep personal context and shared team context under separate access scopes.
- Keep topics/threads, messages, files, artifacts, and AI tasks independently traceable.
- Do not treat file sharing and RAG/knowledge indexing as the same state.
- Give long-running AI work its own task/run state rather than embedding execution state only in messages.
- Keep Browser/Terminal/Workspace runtime sessions separate from persistent collaboration data.
- Make artifacts traceable to their source file or task and to the presentation state that references them.
- Make `tool_runs` trace the tool, status, safe input summary, output references, and timestamps.
- Do not store secrets, tokens, or passwords as normal application data.
- For external or RAG documents, keep metadata such as `source`, `scope`, `owner`, `indexed_at`, and validity/version information when applicable.
- Assume timezone-aware timestamps.
- Apply future schema changes only through migrations.

## Initial candidate tables

The initial candidate table names are listed below for design discussion only. This list is not a schema implementation.

- `spaces`
- `topics`
- `thread_messages`
- `files`
- `artifacts`
- `agent_tasks`
- `task_runs`
- `tool_runs`
- `approvals`
- `browser_sessions`
- `knowledge_documents`
- `knowledge_chunks`
