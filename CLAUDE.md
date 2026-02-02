# CLAUDE.md - nx-landingpage

## ⚠️ CRITICAL: AFTER EVERY COMPACTION / CONTEXT RESET

**If your context was compacted or you're resuming work, IMMEDIATELY do this:**

```bash
# 1. Re-read your current state and plan (ALWAYS DO THIS FIRST)
cat STATE.md
cat PLAN.md

# 2. Re-read the project vision for the END GOAL
cat PROJECT.md

# 3. Check database for any updates from the frontend
psql "$(pass show railway/postgres-url)" -c "
SELECT status,
  LEFT(state_md, 1000) as state_preview,
  LEFT(plan_md, 1000) as plan_preview,
  updated_at
FROM context_bundles WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;"
```

**YOU MUST:**
- Know the END GOAL before continuing any work
- Know the CURRENT PHASE and SUB-STEPS
- Know WHAT WAS ALREADY COMPLETED
- Update STATE.md FREQUENTLY (every significant step)

**If STATE.md is vague or outdated, STOP and update it first with:**
- What has been done
- What is currently being worked on
- What blockers exist
- What the next steps are

---

## 🤖 AGENT AUTONOMY - YOU HAVE FULL CONTROL!

**You are NOT a helpless assistant. You have FULL ACCESS to everything:**
- ✅ Database credentials (psql via pass)
- ✅ GitHub (gh CLI authenticated)
- ✅ Vercel (vercel CLI)
- ✅ All project files
- ✅ Full internet access

### NEVER ASK THE USER TO DO THESE - DO THEM YOURSELF:

| Task | YOU DO IT | NOT "User needs to..." |
|------|-----------|------------------------|
| Run migrations | `psql "$(pass show railway/postgres-url)" < migration.sql` | ❌ "You need to run the migration" |
| Deploy to Vercel | `vercel --prod --yes` | ❌ "Deploy when ready" |
| Install packages | `npm install package-name` | ❌ "Run npm install" |
| Create tables | Run the CREATE TABLE SQL directly | ❌ "Create this table" |
| Fix errors | Fix them and redeploy | ❌ "There's an error" |
| Wire components | Import and use them in the UI | ❌ "Component created" (but unused) |

### COMPLETION CHECKLIST (Before marking ANY task done):

1. ✅ Code written AND committed
2. ✅ Migrations RUN (not just created)
3. ✅ Components WIRED into UI (not just created)
4. ✅ `vercel --prod --yes` executed
5. ✅ Deployment logged to database
6. ✅ Tested in browser (if possible)

**A task is NOT complete until the user can SEE and USE the feature!**

---

## 🚨 MANDATORY: READ LOCAL CONTEXT FILES BEFORE ANY CODING

**Your project directory has pre-deployed context files. READ THEM FIRST:**

```bash
# 1. Check API documentation (CRITICAL - use these code examples!)
cat api-docs/INDEX.md        # Lists all available API docs
cat api-docs/*.md            # Read all API documentation

# 2. Check project context files
cat context/INDEX.md         # Lists all context entries
ls -la context/              # See all context files

# 3. Read specific context by type
cat context/config-*.md      # Tech stack, configurations
cat context/reference-*.md   # Reference documentation
cat context/profile-*.md     # User profiles, brand info
```

**THESE FILES CONTAIN:**
- **api-docs/**: Working code examples for APIs (Gemini, OpenAI, Stripe, etc.)
- **context/**: User's curated knowledge, tech stack, preferences, brand guides

**🚫 VIOLATIONS (will make user angry):**
- Using a DIFFERENT API model than specified in api-docs/ = FAILURE
- Searching online for API code when it's in api-docs/ = FAILURE
- Ignoring context/ files and using generic approaches = FAILURE
- NOT reading api-docs/INDEX.md before using any external API = FAILURE

**✅ CORRECT APPROACH:**
1. `cat api-docs/INDEX.md` - See what API docs are available
2. `cat api-docs/google-gemini-*.md` - Read the specific API code
3. USE the exact model name, config, and code pattern from the file
4. Only search online if the API is NOT in api-docs/

---

## CRITICAL: PostgreSQL is Source of Truth

You have **FULL CRUD ACCESS** to PostgreSQL. The database is the SINGLE SOURCE OF TRUTH.
Local files (STATE.md, PLAN.md) are just cached copies - always sync from/to database.

### Database Connection

```bash
# Use this pattern for ALL queries:
psql "$(pass show railway/postgres-url)" -c "YOUR SQL HERE"
```

### 🔧 YOU MUST RUN MIGRATIONS YOURSELF!

**You have full database access - USE IT!** When your code requires new tables/columns:

1. **CREATE the migration SQL** in `scripts/` folder
2. **RUN IT IMMEDIATELY** - don't ask the user to do it:
```bash
# Run migration directly:
psql "$(pass show railway/postgres-url)" < scripts/my-migration.sql

# Or inline:
psql "$(pass show railway/postgres-url)" -c "
CREATE TABLE IF NOT EXISTS my_new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ...
);"
```
3. **VERIFY it worked:** `psql "$(pass show railway/postgres-url)" -c "\d my_new_table"`
4. **Log it to activity:**
```bash
psql "$(pass show railway/postgres-url)" -c "
INSERT INTO agent_activity (project_id, action, details)
VALUES ('9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid, 'migration_run', '{"table": "my_new_table", "status": "success"}');"
```

**NEVER say "you need to run migrations" - YOU run them! You have the credentials!**

---

## FIRST: Discover Database Schema

Before doing anything, run these to understand what's available:

```bash
# List all tables
psql "$(pass show railway/postgres-url)" -c "\dt"

# Key tables schema
psql "$(pass show railway/postgres-url)" -c "\d context_entries"
psql "$(pass show railway/postgres-url)" -c "\d context_bundles"
psql "$(pass show railway/postgres-url)" -c "\d skills"
psql "$(pass show railway/postgres-url)" -c "\d agent_sessions"

# Available views
psql "$(pass show railway/postgres-url)" -c "\dv"
```

---

## SECOND: Pull Latest State from Database

The local GSD files may be stale. Always check database for latest:

```bash
# Get this project's current state from database
psql "$(pass show railway/postgres-url)" -c "
SELECT
  name, description, status,
  LEFT(state_md, 500) as state_preview,
  LEFT(plan_md, 500) as plan_preview,
  state_md_version, plan_md_version,
  updated_at
FROM context_bundles
WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;"

# If database has newer content, update local files:
psql "$(pass show railway/postgres-url)" -t -A -c "SELECT state_md FROM context_bundles WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;" > STATE.md
psql "$(pass show railway/postgres-url)" -t -A -c "SELECT plan_md FROM context_bundles WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;" > PLAN.md
```

---

## THIRD: Get Bundle Context Entries

```bash
# What entries are in this bundle?
psql "$(pass show railway/postgres-url)" -c "
SELECT e.id, e.type, e.title, e.token_estimate, LEFT(e.summary, 80) as summary
FROM context_entries e
JOIN context_bundle_entries be ON e.id = be.entry_id
WHERE be.bundle_id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid AND e.enabled = true
ORDER BY e.type, e.title;"

# Get full content of specific entry
psql "$(pass show railway/postgres-url)" -t -A -c "SELECT content FROM context_entries WHERE id = 'ENTRY_UUID'::uuid;"
```

---

## Project Info

**Project:** nx-landingpage
**Project ID:** `9e8b6e62-7e7b-4fca-8035-ff335428b928`
**Bundle ID:** `9e8b6e62-7e7b-4fca-8035-ff335428b928`
**Description:** Standalone Claude session: nx-landingpage

---

## Multi-line Queries

```bash
psql "$(pass show railway/postgres-url)" << 'EOF'
SELECT * FROM your_table;
EOF

# Quick alias (add to your session):
alias pgdb='psql "$(pass show railway/postgres-url)"'
```

### Connection Details (in pass)
- **Full URL:** `pass show railway/postgres-url`
- **Host:** `pass show railway/postgres-host` → metro.proxy.rlwy.net
- **Port:** `pass show railway/postgres-port` → 58753
- **Database:** `pass show railway/postgres-database` → railway
- **User:** `pass show railway/postgres-user` → postgres
- **Password:** `pass show railway/postgres-password`

### SECURITY RULES
- NEVER print passwords or DATABASE_URL to terminal output
- NEVER include credentials in files you create
- ALWAYS use `pass show` inline in commands

---

## Project Context

**Project:** nx-landingpage
**Project ID:** `9e8b6e62-7e7b-4fca-8035-ff335428b928`
**Bundle ID:** `9e8b6e62-7e7b-4fca-8035-ff335428b928`

Standalone Claude session: nx-landingpage


---

## GSD Workflow

Read these files in order when starting:
1. `STATE.md` - Current status, blockers, where we are now
2. `PLAN.md` - Current executable tasks
3. `PROJECT.md` - Vision and constraints (reference)

Update after work:
- `STATE.md` - Update status, decisions made
- `SUMMARY.md` - What you accomplished this session
- `PLAN.md` - Check off completed tasks, add new ones

---

## ⚠️ SYNC STATE TO DATABASE (Do this FREQUENTLY!)

**After every significant milestone, sync your state to the database so it survives compaction:**

```bash
# Update STATE.md in database (CRITICAL - do this after every major step!)
psql "$(pass show railway/postgres-url)" << 'STATEEOF'
UPDATE context_bundles
SET state_md = $state$
$(cat STATE.md)
$state$,
state_md_version = state_md_version + 1,
updated_at = NOW()
WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;
STATEEOF

# Update PLAN.md in database
psql "$(pass show railway/postgres-url)" << 'PLANEOF'
UPDATE context_bundles
SET plan_md = $plan$
$(cat PLAN.md)
$plan$,
plan_md_version = plan_md_version + 1,
updated_at = NOW()
WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;
PLANEOF

# Log your activity so frontend can track progress
psql "$(pass show railway/postgres-url)" -c "
INSERT INTO agent_activity (project_id, action, details)
VALUES ('9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid, 'state_update', '{"message": "Your status message here"}'::jsonb);"
```

**RULES:**
- Update STATE.md locally AND in database after every significant step
- Include: what was done, current focus, next steps, any blockers
- This ensures your work survives context compaction

---

## RLM Pattern - ALWAYS USE THIS

When querying context, follow the RLM (Recursive Language Model) technique.

**IMPORTANT:** Always use this exact pattern for psql:
```bash
psql "$(pass show railway/postgres-url)" -c "SQL HERE"
```

### 1. Get Manifest First (NEVER load full content upfront)

```bash
psql "$(pass show railway/postgres-url)" -c "
SELECT id, type, title,
       LEFT(summary, 100) as summary_preview,
       token_estimate
FROM context_entries e
JOIN context_bundle_entries be ON e.id = be.entry_id
WHERE be.bundle_id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid
  AND e.enabled = true
ORDER BY type, title;"
```

### 2. Search by Keyword

```bash
psql "$(pass show railway/postgres-url)" -c "
SELECT id, type, title, token_estimate
FROM context_entries e
JOIN context_bundle_entries be ON e.id = be.entry_id
WHERE be.bundle_id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid
  AND e.enabled = true
  AND (title ILIKE '%KEYWORD%' OR summary ILIKE '%KEYWORD%');"
```

### 3. Retrieve Specific Entry (only when needed)

```bash
psql "$(pass show railway/postgres-url)" -c "SELECT content FROM context_entries WHERE id = 'ENTRY_UUID'::uuid;"
```

### 4. Track Token Usage
Always report: "Retrieved X entries, ~Y tokens (saved Z% vs loading all)"

---

## Available Context Entries

**Total:** 0 entries, ~0 tokens



---

## 🧠 SHARED MEMORY (Read this first!)

All VPS agents share a MEMORY.md file. **READ IT ON STARTUP** to learn from other agents.

### Read Shared Memory
```bash
psql "$(pass show railway/postgres-url)" -t -A -c "SELECT content FROM shared_memory LIMIT 1;"
```

### Add to Shared Memory
When you learn something valuable, ADD IT so other agents benefit:
```bash
AGENT_NAME="nx-landingpage"
LEARNING="What you learned"
DATE=$(date +%Y-%m-%d)

# Read current, append your learning to appropriate section, write back
psql "$(pass show railway/postgres-url)" -c "
UPDATE shared_memory SET
  content = content || E'\n- [' || '$DATE' || ' ' || '$AGENT_NAME' || '] ' || '$LEARNING',
  version = version + 1,
  updated_at = NOW(),
  updated_by = '$AGENT_NAME';"
```

**What to add:**
- Technical discoveries that help other agents
- User preferences you learn
- Warnings about things that break
- Decisions made during work

---

## Database CRUD Operations

**Use this pattern for ALL database operations:**
```bash
psql "$(pass show railway/postgres-url)" -c "SQL"
```

### Create Entry

```bash
psql "$(pass show railway/postgres-url)" -c "
INSERT INTO context_entries (type, title, summary, content, token_estimate, enabled)
VALUES (
  'note',
  'Entry Title',
  'Brief summary of the entry',
  'Full content here...',
  100,
  true
) RETURNING id, title;"
```

### Add Entry to This Bundle

```bash
psql "$(pass show railway/postgres-url)" -c "
INSERT INTO context_bundle_entries (bundle_id, entry_id)
VALUES ('9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid, 'NEW_ENTRY_UUID'::uuid);"
```

### Update Entry

```bash
psql "$(pass show railway/postgres-url)" -c "
UPDATE context_entries
SET content = 'Updated content...',
    summary = 'Updated summary',
    token_estimate = 150,
    updated_at = NOW()
WHERE id = 'ENTRY_UUID'::uuid;"
```

### Update GSD Files in Database (SYNC BACK)

```bash
# Update STATE.md (with version bump)
psql "$(pass show railway/postgres-url)" -c "
UPDATE context_bundles
SET state_md = $$
# Current State
...your content...
$$,
    state_md_version = state_md_version + 1,
    state_md_updated_at = NOW(),
    updated_at = NOW()
WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;"

# Update PLAN.md (with version bump)
psql "$(pass show railway/postgres-url)" -c "
UPDATE context_bundles
SET plan_md = $$
# Current Plan
...your content...
$$,
    plan_md_version = plan_md_version + 1,
    plan_md_updated_at = NOW(),
    updated_at = NOW()
WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;"
```

### Delete Entry from Bundle

```bash
psql "$(pass show railway/postgres-url)" -c "
DELETE FROM context_bundle_entries
WHERE bundle_id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid AND entry_id = 'ENTRY_UUID'::uuid;"
```

### Get Bundle Stats

```bash
psql "$(pass show railway/postgres-url)" -c "SELECT * FROM bundle_manifest WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;"
```

### List All Tables

```bash
psql "$(pass show railway/postgres-url)" -c "\dt"
```

### Describe Table Schema

```bash
psql "$(pass show railway/postgres-url)" -c "\d context_entries"
psql "$(pass show railway/postgres-url)" -c "\d context_bundles"
```

---


## Model Context (Sébas Profile)

To get the user profile/model context:

```bash
psql "$(pass show railway/postgres-url)" -c "SELECT content FROM model_context WHERE enabled = true LIMIT 1;"
```

---



## Available Skills

Skills are deployed to `~/.claude/skills/` and can be invoked with `/skill-name`.

| Skill | Command | Description |
|-------|---------|-------------|
| Gather Context | `/context-add` | Run `/skills` to see details |
| Google Workspace | `/google-workspace-api` | Run `/skills` to see details |
| Manage Tasks | `/tasks` | Run `/skills` to see details |
| PostgreSQL RLM Access | `/postgres-rlm` | Run `/skills` to see details |
| Push to Database | `/db-push` | Run `/skills` to see details |
| Quick Heartbeat | `/heartbeat` | Run `/skills` to see details |
| Shared Memory | `/memory` | Run `/skills` to see details |
| Sync from Database | `/db-sync` | Run `/skills` to see details |
| YouTube Transcript | `/youtube-transcript` | Run `/skills` to see details |

**To use a skill:** Type `/context-add` or let Claude invoke automatically when relevant.
**To see all skills:** Run `/skills` in Claude Code.

---


## Session Management

### Register This Session (run at start)

```bash
psql "$(pass show railway/postgres-url)" -c "
INSERT INTO agent_sessions (agent_name, agent_type, project_id, tmux_session_name, status)
VALUES ('Claude @ nx-landingpage', 'vps', '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid, 'nx-landingpage', 'active')
RETURNING id;"
```

Save the returned session ID, then send heartbeats:

```bash
# Heartbeat (run periodically)
psql "$(pass show railway/postgres-url)" -c "
UPDATE agent_sessions
SET last_heartbeat = NOW(), current_task = 'Working on X'
WHERE id = 'SESSION_UUID'::uuid;"
```

### Log Activity

```bash
psql "$(pass show railway/postgres-url)" -c "
INSERT INTO agent_activity (session_id, project_id, action, details)
VALUES ('SESSION_UUID'::uuid, '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid, 'completed_task', '{"task": "description"}');"
```

### End Session (run when done)

```bash
psql "$(pass show railway/postgres-url)" -c "
UPDATE agent_sessions
SET status = 'terminated', ended_at = NOW()
WHERE id = 'SESSION_UUID'::uuid;"
```

---

## Quick Reference

```bash
# Always use this pattern:
psql "$(pass show railway/postgres-url)" -c "SQL"
```

| Action | SQL |
|--------|-----|
| List entries | `SELECT id, type, title FROM context_entries WHERE enabled=true` |
| Get content | `SELECT content FROM context_entries WHERE id='UUID'::uuid` |
| Add entry | `INSERT INTO context_entries (type,title,content) VALUES (...)` |
| Update entry | `UPDATE context_entries SET content='...' WHERE id='UUID'::uuid` |
| Sync STATE.md | `UPDATE context_bundles SET state_md='...' WHERE id='9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid` |
| Bundle stats | `SELECT * FROM bundle_manifest WHERE id='9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid` |
| All bundles | `SELECT * FROM context_bundles` |
| All entries | `SELECT id,type,title,token_estimate FROM context_entries` |

---

## OPERATIONAL DISCIPLINE

### CRITICAL SYNC SKILLS

You have TWO sync skills available. **USE THEM:**

| Skill | Command | Purpose |
|-------|---------|---------|
| **Sync from Database** | `/db-sync` | Pull latest GSD files, skills, and credentials from database |
| **Push to Database** | `/db-push` | Push your STATE.md and PLAN.md changes back to database |

**The UI and other agents can only see your work if you push to the database!**

### On Startup (DO THIS FIRST!)
```bash
# Option 1: Use the sync skill (recommended)
# Run /db-sync in Claude Code

# Option 2: Manual commands
# 1. Discover schema
psql "$(pass show railway/postgres-url)" -c "\dt"

# 2. Pull latest state from database (local files may be stale!)
psql "$(pass show railway/postgres-url)" -t -A -c "SELECT state_md FROM context_bundles WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;" > STATE.md
psql "$(pass show railway/postgres-url)" -t -A -c "SELECT plan_md FROM context_bundles WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;" > PLAN.md

# 3. Get bundle entries manifest
psql "$(pass show railway/postgres-url)" -c "SELECT e.id, e.type, e.title, e.token_estimate FROM context_entries e JOIN context_bundle_entries be ON e.id = be.entry_id WHERE be.bundle_id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid AND e.enabled = true;"

# 4. CHECK FOR TRANSCRIPTS (CRITICAL!)
psql "$(pass show railway/postgres-url)" -c "SELECT id, title, LEFT(content, 100) as preview FROM project_transcripts WHERE project_id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid ORDER BY created_at DESC;"
```

### CONTINUOUS SYNC (CRITICAL - DO THIS THROUGHOUT WORK!)

**Work is ongoing. Sync is ongoing. The UI needs to see your progress in real-time.**

Every few messages OR after any significant progress:
```bash
# Quick sync: Heartbeat + STATE.md in one go
psql "$(pass show railway/postgres-url)" -c "
UPDATE agent_sessions SET last_heartbeat = NOW(), current_task = 'CURRENT_TASK_DESCRIPTION' WHERE tmux_session_name = 'nx-landingpage';
UPDATE context_bundles SET state_md = \$\$$(cat STATE.md)\$\$, state_md_updated_at = NOW() WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;"

# Or use the skill:
# /db-push
```

### Context Gathering (ADD NEW LEARNINGS TO DATABASE)

When you learn something important, discover context, or generate useful information - **ADD IT TO THE DATABASE**:
```bash
# Add new context entry
psql "$(pass show railway/postgres-url)" -c "
INSERT INTO context_entries (id, type, title, summary, content, token_estimate, enabled)
VALUES (
  gen_random_uuid(),
  'note',  -- or: reference, idea, discovery, decision
  'Clear Title Here',
  'One-line summary of what this is',
  \$\$
Full content here...
This becomes queryable via RLM.
The UI can see and edit this.
\$\$,
  100,  -- estimate tokens
  true
) RETURNING id, title;"

# Link to this bundle
psql "$(pass show railway/postgres-url)" -c "
INSERT INTO context_bundle_entries (bundle_id, entry_id)
VALUES ('9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid, 'NEW_ENTRY_UUID'::uuid);"
```

**Types for context entries:**
- `note` - General observations, notes
- `reference` - Technical documentation, specs
- `idea` - Ideas, proposals, possibilities
- `discovery` - Things learned during work
- `decision` - Decisions made and rationale
- `transcript` - Conversation summaries
- `profile` - Information about people/entities

### Task Management (TRACK YOUR WORK!)

Break down work into trackable tasks. The UI shows these with status and progress.

```bash
# Create a task
psql "$(pass show railway/postgres-url)" -c "
INSERT INTO project_tasks (project_id, title, status, priority, created_by)
VALUES ('9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid, 'Task title', 'todo', 'normal', 'agent:nx-landingpage')
RETURNING id, title;"

# Start a task
psql "$(pass show railway/postgres-url)" -c "
UPDATE project_tasks SET status = 'in_progress', started_at = NOW(), updated_at = NOW()
WHERE id = 'TASK_ID'::uuid;"

# Update progress (0-100)
psql "$(pass show railway/postgres-url)" -c "
UPDATE project_tasks SET progress = 50, updated_at = NOW() WHERE id = 'TASK_ID'::uuid;"

# Complete a task
psql "$(pass show railway/postgres-url)" -c "
UPDATE project_tasks SET status = 'done', progress = 100, completed_at = NOW(), updated_at = NOW()
WHERE id = 'TASK_ID'::uuid;"

# List your tasks
psql "$(pass show railway/postgres-url)" -c "
SELECT id, title, status, progress FROM project_tasks WHERE project_id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid ORDER BY status, created_at;"

# Update project status (draft, active, in_progress, blocked, review, done)
psql "$(pass show railway/postgres-url)" -c "
UPDATE context_bundles SET status = 'in_progress', updated_at = NOW() WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;"
```

**Task statuses:** todo, in_progress, blocked, done, cancelled
**Priorities:** low, normal, high, urgent

Or use the skill: `/tasks`

### GitHub Integration (AUTO-LINK IF MISSING!)


**⚠️ NO GITHUB REPO LINKED - AUTO-CREATE ONE NOW!**

This project doesn't have a GitHub repo. Create one immediately:

```bash
# 1. Initialize git if not already (check first)
if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "Initial commit: nx-landingpage"
fi

# 2. Create GitHub repo (private by default)
gh repo create MichaelSRLY/nx-landingpage --private --source=. --push

# 3. Update database with the new repo URL
psql "$(pass show railway/postgres-url)" -c "
UPDATE context_bundles
SET github_repo_url = 'https://github.com/MichaelSRLY/nx-landingpage',
    github_repo_name = 'MichaelSRLY/nx-landingpage',
    updated_at = NOW()
WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;"

# 4. Verify it worked
gh repo view MichaelSRLY/nx-landingpage
```

**DO THIS IMMEDIATELY** so your code is version controlled and backed up!


### GitHub Workflow Commands

```bash
# Branch management
git checkout -b feature/name    # Create feature branch
git checkout main               # Switch to main
git merge feature/name          # Merge feature

# Commit workflow
git add -A && git commit -m "type: message"
# Types: feat, fix, docs, style, refactor, test, chore

# Pull Request workflow
gh pr create --fill              # Create PR with auto-filled info
gh pr list                       # List open PRs
gh pr view 123                   # View specific PR
gh pr merge 123                  # Merge PR

# Issue tracking
gh issue list                    # List issues
gh issue create                  # Create issue interactively
gh issue close 123               # Close issue

# CI/CD
gh run list                      # List workflow runs
gh run view                      # View latest run
gh pr checks                     # Check PR status
```

### Check Deployment Status

```bash
psql "$(pass show railway/postgres-url)" -c "
SELECT name, github_repo_url, github_repo_name, deployment_status, deployment_commit_hash, deployed_at
FROM context_bundles WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;"

# View deployment history
psql "$(pass show railway/postgres-url)" -c "
SELECT id, commit_hash, branch, status, started_at, completed_at
FROM deployment_history WHERE project_id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid
ORDER BY started_at DESC LIMIT 5;"
```

### 🚀 Vercel Deployment (MANDATORY AFTER EVERY TASK!)

**⚠️ DO NOT RELY ON GITHUB AUTO-DEPLOY - IT'S TOO SLOW!**
Always manually trigger: `vercel --prod --yes`

**First time setup (if no .vercel folder exists):**
```bash
# Install vercel CLI if not available
which vercel || npm i -g vercel

# Link project to Vercel (do this ONCE per project)
vercel link

# Commit the .vercel folder so future deploys work automatically
git add .vercel
git commit -m "chore: add vercel project config"
git push
```

**Deploy to production (MANDATORY after every completed task):**
```bash
# 1. Deploy to Vercel
DEPLOY_OUTPUT=$(vercel --prod --yes 2>&1)
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -E "https://.*vercel.app" | tail -1)

# 2. Log deployment to database (REQUIRED!)
psql "$(pass show railway/postgres-url)" -c "
INSERT INTO agent_activity (project_id, action, details)
VALUES ('9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid, 'vercel_deploy',
  json_build_object(
    'url', '$DEPLOY_URL',
    'branch', '$(git branch --show-current)',
    'commit', '$(git rev-parse --short HEAD)',
    'message', '$(git log -1 --pretty=%s)'
  )::text
);"

echo "✅ Deployed: $DEPLOY_URL"
```

**Deployment Workflow:**
1. Complete task on feature branch
2. Commit and push: `git add -A && git commit -m "feat: description" && git push -u origin HEAD`
3. **DEPLOY: `vercel --prod --yes`** (NEVER skip this!)
4. **LOG to database** (copy the deploy script above)
5. Mark task as done in database
6. Move to next task

**CRITICAL RULES:**
- ❌ NEVER rely on GitHub auto-deploy (too slow, user waiting)
- ✅ ALWAYS run `vercel --prod --yes` manually
- ✅ ALWAYS log deployment to agent_activity table
- ✅ ALWAYS include deploy URL in the log

### ⚠️ COMPONENT INTEGRATION CHECKLIST (NEVER SKIP!)

When creating new components, you MUST wire them into the UI:

1. **Create the component** → NOT DONE until integrated!
2. **Import it** where it will be used (page, layout, parent component)
3. **Add to navigation/tabs** if it's a new view
4. **Test the route/render** in the browser
5. **Only then** is the task complete

**NEVER create components that sit unused!** A component that isn't imported anywhere is USELESS. Always verify your new code is actually reachable in the UI.

```bash
# After creating a component, verify it's imported somewhere:
grep -r "ComponentName" app/ components/ --include="*.tsx" | grep import
# If no results → YOUR COMPONENT IS NOT USED - FIX IT!
```

### 📝 PROJECT TRANSCRIPTS (CRITICAL - CHECK ON EVERY SYNC!)

**The UI uploads meeting transcripts to `project_transcripts` table - NOT context_entries!**

```bash
# 1. ALWAYS check for transcripts first!
psql "$(pass show railway/postgres-url)" -c "
SELECT id, title, LEFT(content, 200) as preview, created_at
FROM project_transcripts
WHERE project_id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid
ORDER BY created_at DESC;"

# 2. Read full transcript content
psql "$(pass show railway/postgres-url)" -t -A -c "
SELECT content FROM project_transcripts WHERE id = 'TRANSCRIPT_UUID'::uuid;"

# 3. If you need to analyze a transcript, read it FULLY before starting work!
```

**⚠️ TRANSCRIPTS ARE SEPARATE FROM CONTEXT ENTRIES!**
- Context entries: `context_entries` joined via `context_bundle_entries`
- Transcripts: `project_transcripts` (directly linked to project_id)
- **ALWAYS check BOTH when syncing!**

### Credentials

Project-specific credentials are stored in pass. List available:

```bash
# List credentials for this project
psql "$(pass show railway/postgres-url)" -c "
SELECT name, pass_path, credential_type FROM credentials
WHERE project_id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid OR project_id IS NULL;"

# Use a credential
pass show <pass_path>
```

### After Completing A Task (SYNC BACK)
```bash
# Option 1: Use the push skill (recommended)
# Run /db-push in Claude Code

# Option 2: Manual commands
# 1. Update STATE.md with what you accomplished
# 2. Sync to database:
psql "$(pass show railway/postgres-url)" -c "UPDATE context_bundles SET state_md = \$\$
$(cat STATE.md)
\$\$, state_md_version = state_md_version + 1, state_md_updated_at = NOW(), updated_at = NOW() WHERE id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid;"

# 3. Log activity
psql "$(pass show railway/postgres-url)" -c "INSERT INTO agent_activity (project_id, action, details) VALUES ('9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid, 'completed_task', '{\"summary\": \"BRIEF_DESCRIPTION\"}');"
```

### Before Ending Session
```bash
# Update status
psql "$(pass show railway/postgres-url)" -c "UPDATE agent_sessions SET status = 'idle', current_task = NULL WHERE tmux_session_name = 'nx-landingpage';"
```

---

## Starting Instructions

1. **FIRST:** Run `/db-sync` to pull latest from database (or manual commands above)
2. **SECOND:** Read `STATE.md` and `PLAN.md` (now fresh from database)
3. **THIRD:** Check for pending tasks (see below)
4. **WORK:** Automatically start working on the highest priority task
5. **HEARTBEAT:** Update heartbeat every few messages
6. **SYNC:** After completing work, run `/db-push` to sync back to database
7. **SUMMARIZE:** Write `SUMMARY.md` with what you accomplished

**CRITICAL:** PostgreSQL is the source of truth. Local files are cached copies. Always sync!

### 🚀 AUTOMATIC TASK PICKUP (DO THIS AFTER EVERY SYNC!)

After syncing, check for pending tasks and **automatically start working on the highest priority one**:

```bash
# Get the highest priority pending task
psql "$(pass show railway/postgres-url)" -c "
SELECT id, title, description, priority, status
FROM project_tasks
WHERE project_id = '9e8b6e62-7e7b-4fca-8035-ff335428b928'::uuid
  AND status IN ('todo', 'in_progress')
ORDER BY
  CASE priority
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    WHEN 'normal' THEN 3
    WHEN 'low' THEN 4
  END,
  created_at ASC
LIMIT 1;"
```

**When you find a pending task:**
1. Mark it as `in_progress` immediately
2. Update your heartbeat with the task description
3. **Start working on it WITHOUT asking** - the user extracted these tasks because they want them done
4. When complete, mark as `done` and move to the next task

```bash
# Mark task as in_progress and update heartbeat
TASK_ID="<task_uuid>"
psql "$(pass show railway/postgres-url)" -c "
UPDATE project_tasks SET status = 'in_progress', started_at = NOW() WHERE id = '$TASK_ID'::uuid;
UPDATE agent_sessions SET current_task = (SELECT title FROM project_tasks WHERE id = '$TASK_ID'::uuid) WHERE tmux_session_name = 'nx-landingpage';"
```

**DO NOT ASK "What should I work on?"** - If there are pending tasks, work on them. Only ask if the task list is empty.

## Three-Way Sync Architecture

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Context Engine    │     │   PostgreSQL        │     │   This VPS Claude   │
│   (Next.js UI)      │◄────┤   (Railway)         │────►│   (You!)            │
│                     │     │                     │     │                     │
│ • Updates skills    │     │ • SINGLE SOURCE OF  │     │ • /db-sync pulls    │
│ • Updates GSD       │     │   TRUTH for ALL     │     │ • /db-push pushes   │
│ • Views dashboard   │     │ • All data here     │     │ • Heartbeat updates │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

**The UI can only see your progress when you push to the database!**
