# SparkCrew Skills

This directory contains AI-facing skill documents for repeatable tasks, tools, and procedures. Skills are execution procedures, not the product's top-level information architecture. Create a `SKILL.md` only when a workflow is reusable and benefits from explicit inputs, constraints, tool steps, validation, and stop conditions.

Existing skill documents come from the repository's earlier experiments and may still be reused when their task is in scope. They do not define SparkCrew's core collaboration model.

## Current skills

- [`playwright-evidence`](playwright-evidence/SKILL.md): browser/UI execution and visual evidence workflow.
- [`postman-api-evidence`](postman-api-evidence/SKILL.md): API request/response verification with Newman/Postman CLI.
- [`vulnerability-scan`](vulnerability-scan/SKILL.md): specialized CLI scanner workflow.
- [`compliance-rag`](compliance-rag/SKILL.md): specialized RAG/reference workflow with source separation and human review.
- [`visual-judge`](visual-judge/SKILL.md): vision-assisted comparison when structured checks are not sufficient.
- [`db-migration`](db-migration/SKILL.md): future DB migration procedure; do not change DB schema now.

Future SparkCrew-specific skills may cover browser tasks, workspace/terminal tasks, knowledge retrieval, artifact generation, and other repeatable agent workflows when those features are implemented.
