# Copilot CLI Auto-Approval Wrapper

This wrapper enables continual auto-prompts for GitHub Copilot CLI without requiring manual approvals.

## Features

- ✅ **Auto-approval**: Automatically approves all tool executions
- ✅ **Safety limits**: Configurable max iterations and duration
- ✅ **Tool filtering**: Deny specific dangerous operations
- ✅ **Two modes**: Interactive and direct execution
- ✅ **Configurable**: JSON config file or CLI arguments
- ✅ **Session management**: Continue and resume previous sessions (opt-in)

## Installation

```bash
# From this directory
npm install -g .

# Or link for development
npm link
```

## Quick Start

```bash
# Interactive mode with auto-approval
copilot-auto

# Direct mode with a specific task
copilot-auto "Create a new Express server with authentication"

# With custom limits
copilot-auto --max-iterations 100 "Refactor the entire codebase"
```

## Configuration

### Option 1: Config File

Create `~/.copilot-auto-config.json`:

```json
{
  "maxIterations": 50,
  "maxDuration": 1800000,
  "allowAllTools": true,
  "allowAllPaths": false,
  "deniedTools": [
    "shell(rm -rf *)",
    "shell(git push)",
    "shell(npm publish)"
  ],
  "model": "claude-sonnet-4.5"
}
```

### Option 2: CLI Arguments

```bash
copilot-auto \
  --max-iterations 100 \
  --max-duration 3600000 \
  --model gpt-5 \
  --deny-tool "shell(rm *)" \
  --deny-tool "shell(git push)" \
  "Your prompt here"
```

## Safety Features

### Iteration Limits
Prevents infinite loops by limiting the number of actions:
```bash
copilot-auto --max-iterations 30 "Your task"
```

### Time Limits
Automatically stops after a specified duration:
```bash
copilot-auto --max-duration 600000 "Your task"  # 10 minutes
```

### Tool Denial
Block specific dangerous operations:
```bash
copilot-auto --deny-tool "shell(rm *)" --deny-tool "shell(git push)"
```

### Path Restrictions
By default, file access is limited to the current directory. Use `--allow-all-paths` to override:
```bash
copilot-auto --allow-all-paths "Your task"
```

## Usage Examples

### Example 1: Build a Complete Feature
```bash
copilot-auto "Create a REST API for user management with CRUD operations, \
including tests and documentation"
```

### Example 2: Debug and Fix
```bash
copilot-auto "Find and fix all bugs in the application, then run tests"
```

### Example 3: Interactive Session
```bash
copilot-auto --max-iterations 200
# Then interact normally, but with auto-approval
```

### Example 4: Safe Refactoring
```bash
copilot-auto \
  --deny-tool "shell(git push)" \
  --deny-tool "shell(npm publish)" \
  --max-iterations 100 \
  "Refactor the entire codebase to use TypeScript"
```

## How It Works

1. **Spawns Copilot CLI**: Launches the official `copilot` command as a child process
2. **Passes Flags**: Automatically adds `--allow-all-tools` and other configured flags
3. **Monitors Output**: Watches for prompts and automatically responds
4. **Enforces Limits**: Tracks iterations and duration, stopping when limits are reached
5. **Graceful Exit**: Properly terminates the CLI when stopping

## Modes

### Interactive Mode (Default without prompt)
```bash
copilot-auto
```
Starts an interactive session where Copilot can continue working with auto-approval.

### Direct Mode (Default with prompt)
```bash
copilot-auto "Your task here"
```
Executes a single task and exits when complete.

## Session Management

Session management allows you to continue or resume previous Copilot sessions within a repository. This is an **opt-in** feature that must be explicitly enabled.

### How It Works

When session management is enabled, `copilot-auto` stores a lightweight pointer to the most recent session in `.copilot-auto/session-state.json` (gitignored) in your repository root. This enables repo-scoped session tracking, avoiding the issue of accidentally resuming sessions from different repositories.

The state file contains only:
- Repository root path
- Last session ID (if available)
- Timestamp of last use
- Copilot CLI version

**Important**: No sensitive data, prompts, or tool outputs are stored locally by `copilot-auto`. Session data is managed by the official Copilot CLI.

### Enabling Session Management

#### Option 1: Config File
Add to your `~/.copilot-auto-config.json`:
```json
{
  "session": {
    "enabled": true,
    "mode": "continue"
  }
}
```

#### Option 2: CLI Flags
Use `--enable-session` or use `--continue`/`--resume` flags directly (which auto-enable it):
```bash
copilot-auto --enable-session "Your task"
```

### Continue Previous Session

Resume the most recent session for this repository:
```bash
copilot-auto --continue "Add more tests"
```

Short form:
```bash
copilot-auto -C "Continue working on the feature"
```

### Resume Specific Session

Resume a specific session by ID or use interactive picker:
```bash
# Interactive picker mode
copilot-auto --resume "Complete authentication"

# With specific session ID (if you know it)
copilot-auto --resume <session-id> "Continue this work"
```

### Repo-Scoped Safety

The wrapper implements repo-scoped session tracking to prevent "wrong repo session" issues:

1. When `--continue` is used, the wrapper looks for the last session associated with the current repository
2. It searches `.copilot-auto/session-state.json` for a saved session ID
3. If not found, it scans `~/.copilot/session-state/` for sessions mentioning this repository path
4. Only then does it fall back to the default Copilot CLI behavior

This approach minimizes the risk of accidentally continuing a session from a different repository with the same branch name.

### Session State Storage

The repo-local session state is stored at:
```
<repo-root>/.copilot-auto/session-state.json
```

This file is automatically gitignored. To clear session history:
```bash
rm -rf .copilot-auto/
```

### Example Workflows

#### Workflow 1: Multi-day feature development
```bash
# Day 1: Start feature
copilot-auto --enable-session "Create user authentication system"

# Day 2: Continue where you left off
copilot-auto --continue "Add password reset functionality"

# Day 3: Keep building
copilot-auto -C "Add OAuth integration"
```

#### Workflow 2: Working across multiple repos
```bash
cd ~/project-a
copilot-auto --continue "Add tests"  # Continues project-a session

cd ~/project-b
copilot-auto --continue "Refactor"   # Continues project-b session (not project-a!)
```

### Disabling Session Management

Sessions are **disabled by default**. To explicitly disable if enabled in config:
```bash
# Session flags simply aren't used
copilot-auto "Your task"  # Fresh session, no continuation
```

Or remove the `session` configuration from your config file.

## Troubleshooting

### "copilot: command not found"
Make sure GitHub Copilot CLI is installed:
```bash
npm install -g @github/copilot
```

### Wrapper stops too early
Increase the limits:
```bash
copilot-auto --max-iterations 200 --max-duration 3600000
```

### Dangerous operations being executed
Add them to denied tools:
```bash
copilot-auto --deny-tool "shell(dangerous-command)"
```

## Configuration Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxIterations` | number | 50 | Maximum number of iterations before stopping |
| `maxDuration` | number | 1800000 | Maximum duration in milliseconds (30 min) |
| `allowAllTools` | boolean | true | Allow all tools to run without confirmation |
| `allowAllPaths` | boolean | false | Allow access to all file paths |
| `deniedTools` | array | [] | List of tools to deny |
| `model` | string | "claude-sonnet-4.5" | AI model to use |
| `session.enabled` | boolean | false | Enable session management features |
| `session.mode` | string | "continue" | Default session mode ("continue" or "resume") |

## Safety Recommendations

For production use, consider these safety measures:

1. **Always set iteration limits**: Prevents runaway processes
2. **Use time limits**: Ensures the process doesn't run indefinitely
3. **Deny dangerous operations**: Block `rm`, `git push`, `npm publish`, etc.
4. **Restrict paths**: Don't use `--allow-all-paths` unless necessary
5. **Monitor logs**: Check `~/.copilot/logs/` for activity
6. **Run in containers**: For maximum isolation
7. **Use version control**: Always work in a git repo with uncommitted changes

## Development

```bash
# Clone and link
cd copilot-cli
npm link

# Make changes to index.js

# Test
copilot-auto --help
```

## License

MIT - Same as the parent repository
