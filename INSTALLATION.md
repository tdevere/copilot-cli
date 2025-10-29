# Installation & Setup Guide

## Prerequisites

Before installing the auto-approval wrapper, ensure you have:

1. ✅ **Node.js v22+** installed
2. ✅ **GitHub Copilot CLI** installed: `npm install -g @github/copilot`
3. ✅ **Active Copilot subscription**
4. ✅ **Authenticated** with GitHub (run `copilot` and use `/login`)

## Installation

### Method 1: Global Install (Recommended)

```bash
cd copilot-cli
npm install -g .
```

### Method 2: Development Link

```bash
cd copilot-cli
npm link
```

### Method 3: Direct Install from npm (Future)

```bash
# Once published
npm install -g copilot-cli-auto
```

## Verification

Check that installation was successful:

```bash
# Check version
copilot-auto --version

# View help
copilot-auto --help

# View examples
npm run examples
```

## Configuration

### Quick Start (No Config Needed)

The wrapper works out of the box with sensible defaults:
- Max 50 iterations
- 30-minute timeout
- All tools allowed
- Restricted to current directory

```bash
copilot-auto "Your task here"
```

### Custom Configuration (Optional)

Create `~/.copilot-auto-config.json` for persistent settings:

```bash
# Copy the example config
cp .copilot-auto-config.example.json ~/.copilot-auto-config.json

# Edit with your preferences
code ~/.copilot-auto-config.json
```

Example configuration:

```json
{
  "maxIterations": 100,
  "maxDuration": 3600000,
  "allowAllTools": true,
  "allowAllPaths": false,
  "deniedTools": [
    "shell(rm -rf *)",
    "shell(git push --force)",
    "shell(npm publish)",
    "shell(sudo *)"
  ],
  "model": "claude-sonnet-4.5"
}
```

### Configuration Priority

1. **CLI arguments** (highest priority)
2. **Config file** (`~/.copilot-auto-config.json`)
3. **Default values** (lowest priority)

Example of overriding config:

```bash
# Config file says maxIterations: 50
# But CLI override sets it to 100
copilot-auto --max-iterations 100 "Your task"
```

## First Run

### Test Basic Functionality

```bash
# Simple test
copilot-auto "Create a file called hello.txt with 'Hello World'"

# Verify it worked
cat hello.txt
```

### Test with Limits

```bash
copilot-auto \
  --max-iterations 10 \
  --max-duration 60000 \
  "List all JavaScript files in this directory"
```

### Test Interactive Mode

```bash
copilot-auto --max-iterations 20
# Then interact normally, but with auto-approval
```

## Usage Patterns

### Pattern 1: One-Shot Tasks

```bash
copilot-auto "Generate a REST API with Express"
```

### Pattern 2: Safe Refactoring

```bash
copilot-auto \
  --deny-tool "shell(git push)" \
  --max-iterations 50 \
  "Refactor to use async/await"
```

### Pattern 3: Long-Running Tasks

```bash
copilot-auto \
  --max-iterations 200 \
  --max-duration 7200000 \
  "Build a complete CRUD application with tests"
```

### Pattern 4: Custom Model

```bash
copilot-auto --model gpt-5 "Complex reasoning task"
```

## Troubleshooting

### Issue: "copilot: command not found"

**Solution:** Install GitHub Copilot CLI first:
```bash
npm install -g @github/copilot
copilot  # Authenticate if needed
```

### Issue: "copilot-auto: command not found"

**Solution:** Reinstall the wrapper:
```bash
cd copilot-cli
npm install -g .
# or
npm link
```

### Issue: Wrapper stops too early

**Solution:** Increase limits:
```bash
copilot-auto \
  --max-iterations 200 \
  --max-duration 3600000 \
  "Your task"
```

### Issue: Unwanted operations being executed

**Solution:** Use deny list:
```bash
copilot-auto \
  --deny-tool "shell(rm *)" \
  --deny-tool "shell(git push)" \
  "Your task"
```

### Issue: Need access to files outside current directory

**Solution:** Use `--allow-all-paths` (use with caution):
```bash
copilot-auto --allow-all-paths "Your task"
```

## Safety Best Practices

1. **Start Small**: Begin with low iteration counts (10-20) and increase as needed
2. **Use Deny Lists**: Always deny dangerous operations
3. **Monitor First Run**: Watch the first execution to understand behavior
4. **Version Control**: Always work in a git repo so you can revert changes
5. **Review Logs**: Check `~/.copilot/logs/` for detailed activity
6. **Container Isolation**: For maximum safety, run in Docker/containers
7. **Backup Important Files**: Before running on production code

## Recommended Denial List

Add these to your config to prevent accidents:

```json
{
  "deniedTools": [
    "shell(rm -rf *)",
    "shell(rm -rf /)",
    "shell(git push --force)",
    "shell(git push origin)",
    "shell(npm publish)",
    "shell(sudo *)",
    "shell(dd *)",
    "shell(mkfs *)",
    "shell(format *)"
  ]
}
```

## Uninstallation

```bash
# If installed globally
npm uninstall -g copilot-cli-auto

# If linked
cd copilot-cli
npm unlink

# Remove config
rm ~/.copilot-auto-config.json
```

## Next Steps

- Read [AUTO-WRAPPER-README.md](./AUTO-WRAPPER-README.md) for detailed documentation
- Run `npm run examples` for usage examples
- Try a simple task to get familiar with the tool
- Configure your deny list for safety
- Share feedback and report issues!

## Getting Help

- Run `copilot-auto --help` for quick reference
- Check the logs at `~/.copilot/logs/` for debugging
- Open an issue in the repository
- Review the examples: `npm run examples`
