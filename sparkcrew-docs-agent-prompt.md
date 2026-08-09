# SparkCrew 문서 전환 패치 적용 프롬프트

## 작업 목적

현재 저장소의 문서와 AI-facing 지침은 `Vericus`를 GUI/CLI 테스트, 취약점 분석, 컴플라이언스 검증, 감사 증거 보고 중심의 evidence-driven workspace로 정의하고 있다.

이번 작업의 목적은 기존 코드나 실행 scaffold를 변경하지 않고, 프로젝트 이름과 문서의 최상위 방향을 **SparkCrew**로 일관되게 전환하는 것이다.

SparkCrew는 다음과 같이 정의한다.

> SparkCrew는 사람과 AI가 개인 및 팀 컨텍스트에서 대화하고, 파일과 지식을 공유하며, 필요할 때 Browser·Terminal·Workspace를 활용해 함께 작업 결과를 만드는 AI 협업 프로젝트다.

핵심 협업 모델은 단체 채팅 하나에 모든 정보를 쌓는 방식이 아니라 다음 구조를 지향한다.

- 개인 AI 대화와 개인 Topic
- SNS형 팀 Topic/Post와 Thread
- 사람과 함께 Topic/Thread에 참여하는 공유 AI
- 파일 공유와 RAG/지식 등록의 분리
- 채팅 흐름과 독립된 AI 백그라운드 작업
- 필요할 때 사용하는 Browser·Terminal·Workspace 실행 환경
- 문서·이미지·동영상·차트·표·Notebook/HTML 결과·라이브 Browser를 함께 보는 공유 결과 화면
- Browser 기반 Computer Use를 우선
- 전체 OS 데스크톱 스트리밍/제어는 현재 범위에서 제외

이번 작업은 **문서 전환 작업**이다. 위 기능이 현재 모두 구현되어 있다고 표현해서는 안 된다.

## 작업 대상

제공된 `sparkcrew-docs.patch`를 기준본으로 사용한다.

변경 대상은 다음 15개 파일로 제한한다.

- `README.md`
- `AGENTS.md`
- `docs/README.ko.md`
- `docs/README.en.md`
- `docs/CONTEXT.md`
- `docs/ARCHITECTURE.md`
- `docs/STATE-SCHEMA.md`
- `docs/TESTING.md`
- `docs/database-schema-guidelines.ko.md`
- `docs/database-schema-guidelines.en.md`
- `frontend/README.md`
- `backend/README.md`
- `skills/README.md`
- `.github/copilot-instructions.md`
- `.cursor/rules/vericus.mdc`

`.cursor/rules/vericus.mdc`는 이번 작업에서 **내용만 SparkCrew 기준으로 수정하고 파일명은 바꾸지 않는다.**
GitHub 저장소명 `Vericus`도 이번 작업에서 변경하지 않는다.

새 `PRODUCT.md`, 별도 설계 문서, 새 폴더를 만들지 않는다.

## 변경 내용

### 1. 프로젝트 이름과 설명

문서 본문에서 프로젝트명을 `SparkCrew`로 전환한다.

기존의 다음 최상위 정의는 SparkCrew의 프로젝트 정의로 교체한다.

- evidence-driven workspace
- GUI/CLI 테스트 중심 프로젝트
- vulnerability/compliance/audit 중심 프로젝트
- LangGraph 자체를 제품 아키텍처의 중심으로 보는 설명
- case/evidence/report를 최상위 제품 객체로 보는 설명

다만 기존 스캐너, 컴플라이언스 RAG, evidence 관련 skill 파일 자체는 이번 작업에서 삭제하거나 수정하지 않는다.
`skills/README.md`에서는 해당 skill들이 기존 실험에서 남아 있는 재사용 가능한 task-level procedure이며 SparkCrew의 제품 정체성을 정의하지 않는다고 명확히 한다.

### 2. 현재 구현과 방향을 구분

현재 실제 scaffold 사실은 유지한다.

- Frontend: Next.js, React, TypeScript, Tailwind CSS, axios, SweetAlert2, Playwright
- Backend: Django, Django REST Framework, Django Admin, Django ORM, django-cors-headers
- `/api/*` Next.js rewrite
- `GET /api/health/`
- `/admin/`
- 현재 custom domain model/migration/SQL, Docker, Nginx, K8s, Helm 등이 아직 포함되지 않은 사실

Topic/Thread, RAG, AI background task, Browser/Terminal/Workspace, 공유 결과 화면 등은 **project direction**으로 표현하고 구현 완료로 서술하지 않는다.

### 3. 개인과 팀 컨텍스트

다음 경계를 문서에서 명확히 한다.

- 개인 AI 대화/파일/작업 컨텍스트는 기본적으로 사용자 전용이다.
- 팀 Topic/Thread는 사람과 공유 AI가 함께 사용하는 공개 협업 컨텍스트다.
- 개인 컨텍스트는 사용자가 명시적으로 공유하기 전까지 팀 컨텍스트에 노출하지 않는다.
- 공유 AI는 현재 권한으로 허용된 Topic/Thread, 파일, 지식, 도구만 사용한다.

### 4. 파일과 RAG 분리

파일 업로드와 RAG/지식 인덱싱을 같은 동작으로 취급하지 않는다.

최소한 개념적으로 다음 scope를 구분한다.

- 개인 파일/컨텍스트
- 현재 Topic/Thread 파일
- 팀/프로젝트 지식
- 조직 지식
- 외부 소스

파일을 업로드했다고 자동으로 팀 또는 조직 RAG에 등록된다고 표현하지 않는다.

### 5. 채팅과 백그라운드 작업 분리

AI의 장시간 실행은 chat message 자체의 상태가 아니라 별도 task/run 상태로 설명한다.

대화, task, file/artifact, execution runtime은 서로 다른 concern으로 유지한다.

Background task가 실행되는 동안 일반 대화가 계속 가능해야 한다는 방향을 반영한다.

### 6. Browser / Terminal / Workspace

현재 방향에서는 다음을 구분한다.

- Browser: 주요 interactive Computer Use 대상
- Playwright/CDP: 가능한 경우 결정론적 browser automation 수단
- Terminal: task-scoped command execution
- Workspace: task-scoped 파일 작업 공간
- 전체 OS 데스크톱 streaming/control: 현재 scope 밖

Browser/Terminal/Workspace는 persistent collaboration data 자체가 아니라 필요할 때 붙는 실행 runtime으로 설명한다.

### 7. 공유 결과 화면

문서·이미지·동영상·차트·표·Notebook/HTML 결과·라이브 Browser를 함께 보는 shared viewing/presentation surface 방향을 반영한다.

이 화면은 underlying file/artifact의 canonical storage가 아니라 presentation state로 설명한다.

### 8. Backend와 orchestration 방향

Django + DRF + Django ORM을 기본 control plane으로 유지한다.

장시간 AI 작업과 Browser/Terminal/Workspace 실행은 정상 HTTP request 처리와 분리하는 방향으로 설명한다.

FastAPI/SQLAlchemy는 현재 stack에 추가하지 않는다.

LangGraph, DeepAgents 등은 사용할 수 있는 agent orchestration 구현 선택지일 뿐 SparkCrew의 domain contract가 특정 agent framework에 종속되지 않도록 문서를 수정한다.

### 9. Free-threading

SparkCrew는 free-threaded Python 호환성을 전제로 설계한다고 문서화한다.

- 애플리케이션 정확성을 GIL의 암묵적 직렬화에 의존하지 않는다.
- 보호되지 않은 process-global mutable state를 피한다.
- 필요한 공유 상태는 명시적 synchronization 또는 PostgreSQL/Redis/queue 같은 외부 state를 사용한다.
- ASGI async I/O와 free-threading은 상호 대체가 아니라 보완 관계로 본다.
- native/third-party dependency의 free-threading/thread-safety는 실제 실행 전에 검증한다.
- GIL-enabled CPython은 호환성/안정성 fallback으로 유지한다.

실제로 free-threaded 환경에서 테스트하지 않았다면 지원 검증이 끝났다고 표현하지 않는다.

## 변경 금지

이번 작업에서는 다음을 하지 않는다.

- frontend/backend 소스 코드 수정
- `package.json`, lockfile, requirements 변경
- DB model/schema/migration 변경
- Docker/Nginx/K8s/Helm/CI 추가
- 새 문서 체계 생성
- `.cursor/rules/vericus.mdc` 파일 rename
- GitHub 저장소 rename
- 브랜치 생성/전환
- staging
- commit
- push
- PR 생성/수정
- 기존 사용자 변경 삭제 또는 되돌리기

패치 적용 전 현재 working tree와 diff를 확인하고, 사용자의 기존 변경이 있으면 덮어쓰지 않는다.

## 패치 적용 방법

먼저 현재 상태를 확인한다.

```bash
git status --short
git diff -- README.md AGENTS.md docs frontend/README.md backend/README.md skills/README.md .github/copilot-instructions.md .cursor/rules/vericus.mdc
```

그 다음 패치가 현재 상태에 적용 가능한지 확인한다.

```bash
git apply --check sparkcrew-docs.patch
```

충돌이 없다면 적용한다.

```bash
git apply sparkcrew-docs.patch
```

`git apply --check`가 실패하면 무조건 reset/revert하지 않는다.
현재 파일과 patch를 비교하고 기존 사용자 변경을 보존하면서 동일한 문서 방향을 수동으로 반영한다.

## 테스트 방법

이번 변경은 문서와 instruction 파일만 변경하므로 Playwright, Django 실행 테스트, Postman/Newman 실행은 필요하지 않다.

다음 검증을 수행한다.

### 1. 변경 파일 범위

```bash
git diff --name-only
```

위에 명시한 15개 파일 외 변경이 없어야 한다.

### 2. whitespace / patch 검증

```bash
git diff --check
```

오류가 없어야 한다.

### 3. stale 프로젝트 설명 확인

```bash
rg -n "Vericus|evidence-driven workspace|case workspace|evidence timeline"   README.md AGENTS.md docs/README.*.md docs/CONTEXT.md docs/ARCHITECTURE.md   docs/STATE-SCHEMA.md docs/database-schema-guidelines.*.md   frontend/README.md backend/README.md skills/README.md   .github/copilot-instructions.md .cursor/rules/vericus.mdc
```

의도하지 않은 기존 프로젝트명/정의가 남아 있지 않아야 한다.

`.cursor/rules/vericus.mdc`의 **파일 경로명**은 이번 작업 범위에서 유지한다.

### 4. 문서 내용 검토

아래가 실제 문서에 일관되게 반영되었는지 확인한다.

- SparkCrew 프로젝트명
- 개인 AI와 팀 공유 AI의 컨텍스트 경계
- Topic/Thread 중심 협업
- File 공유와 RAG indexing 분리
- Conversation / Background Task / Artifact / Runtime 분리
- Browser 우선 Computer Use
- Terminal/Workspace task runtime 방향
- 전체 OS desktop streaming/control 현재 범위 제외
- Django control plane 유지
- agent framework 비종속
- free-threading 전제와 GIL fallback
- 현재 구현과 향후 방향의 구분

## 결과 보고

완료 시 다음만 간결하게 보고한다.

- 변경한 15개 파일
- SparkCrew로 바뀐 핵심 프로젝트 정의
- 실제 수행한 검증 명령과 결과
- 코드/DB/package/deployment 파일은 변경하지 않았다는 점
- commit/push/PR은 수행하지 않았다는 점
- 적용 과정에서 patch 충돌이나 기존 사용자 변경이 있었으면 그 처리 내용
