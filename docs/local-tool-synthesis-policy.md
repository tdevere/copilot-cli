# Local Tool Synthesis Policy

## Overview

This document defines the local tool synthesis policy for the Copilot CLI Auto-Approval Wrapper. This feature enables dynamic tool creation and registration without relying on external services or MCP (Model Context Protocol) servers.

## Non-negotiable: Never Use MCP Servers

**This policy strictly prohibits the use of MCP servers or any remote tool brokers/registries.**

When the MCP prevention flag is enabled (`--no-mcp` or `COPILOT_NO_MCP=1`), the system will:
- NOT enumerate MCP servers
- NOT connect to MCP endpoints
- NOT invoke any MCP-based tools
- Skip all MCP integration code paths

This ensures complete isolation from external tool providers and maintains full local control.

## Local Tool Synthesis by Default (Opt-in)

When enabled via flags or environment variables, the wrapper will automatically scaffold new tools locally when they are requested but not available.

**Important: This feature is DISABLED by default** and must be explicitly opted into via:
- CLI flag: `--enable-local-tool-synthesis`
- Environment variable: `COPILOT_LOCAL_TOOL_SYNTHESIS=1`

### Why Opt-in?

To maintain backward compatibility and avoid changing behavior for existing applications, this feature requires explicit activation. Users must consciously choose to enable local tool synthesis.

## Tool Synthesis Protocol

### Workflow

When a tool is requested that doesn't exist in the local registry:

1. **Detection**: The tool dispatcher detects the missing tool
2. **Check Configuration**: Verify that local tool synthesis is enabled
3. **Scaffold Creation**: Generate a tool skeleton with:
   - Tool specification file (`tools/<toolname>/tool.md`)
   - Stub implementation (`tools/<toolname>/src/index.js`)
   - Registry entry update (`tools/manifest.json`)
4. **Notification**: Inform the user that a scaffold was created
5. **Return**: Return a placeholder result indicating implementation is needed

### File Structure

```
tools/
├── manifest.json           # Central registry of all local tools
├── my-custom-tool/
│   ├── tool.md            # Tool specification and documentation
│   ├── src/
│   │   └── index.js       # Tool implementation
│   └── tests/             # Optional: tool tests
│       └── test.js
```

### Manifest Schema

The `tools/manifest.json` file maintains a registry of all local tools:

```json
{
  "version": "1.0.0",
  "tools": {
    "my-custom-tool": {
      "name": "my-custom-tool",
      "description": "Description of what this tool does",
      "command": "node",
      "args": ["tools/my-custom-tool/src/index.js"],
      "schema": {
        "parameters": {
          "type": "object",
          "properties": {},
          "required": []
        }
      },
      "createdAt": "2026-02-02T17:00:00.000Z",
      "status": "scaffold"
    }
  }
}
```

### Tool Specification Template

Each tool's `tool.md` file contains:

```markdown
# Tool: <toolname>

## Status
**Scaffold** - Implementation needed

## Purpose
[Auto-generated or user-specified description]

## Parameters
[Expected input parameters and their types]

## Implementation Notes
This is a scaffolded tool. To complete implementation:
1. Edit `src/index.js` with actual functionality
2. Add tests in `tests/` directory
3. Update status in `tools/manifest.json` to "implemented"
4. Test thoroughly before use

## Usage Example
[How to invoke this tool once implemented]
```

### Stub Implementation

The generated `src/index.js` stub:

```javascript
#!/usr/bin/env node

/**
 * Auto-generated tool scaffold
 * Tool: <toolname>
 * Created: <timestamp>
 * 
 * TODO: Implement actual functionality
 */

console.error('Tool scaffold created locally. Implement me.');
console.error('Edit: tools/<toolname>/src/index.js');
process.exit(1);
```

## Safety and Idempotency

- **No Overwrites**: Existing tools are never overwritten during scaffold generation
- **Safe Naming**: Tool names are converted to kebab-case for safe filesystem usage
- **Validation**: Tool names must match pattern: `^[a-z][a-z0-9-]*$`
- **Atomic Operations**: Registry updates are atomic to prevent corruption

## Configuration Options

### CLI Flags

- `--enable-local-tool-synthesis` (boolean, default: `false`)
  - Enables automatic tool scaffold generation
  
- `--no-mcp` (boolean, default: `false`)
  - Prevents all MCP server usage
  - Recommended when using local tool synthesis for complete isolation

### Environment Variables

- `COPILOT_LOCAL_TOOL_SYNTHESIS=1|true|yes|on`
  - Enables local tool synthesis (same as CLI flag)
  
- `COPILOT_NO_MCP=1|true|yes|on`
  - Disables MCP (same as CLI flag)

### Precedence

1. Command-line flags (highest priority)
2. Environment variables
3. Configuration file settings
4. Default values (lowest priority)

## Integration with Existing Tools

The local tool synthesis system integrates with the existing wrapper architecture:

1. **Tool Resolution**: Before invoking a tool, check local registry first
2. **Fallback Logic**: If tool not found and synthesis disabled, follow normal error path
3. **No Breaking Changes**: Existing tool invocation patterns remain unchanged
4. **Transparent Operation**: Users without flags enabled see no difference

## Development Workflow

### For Users

1. Enable local tool synthesis: `copilot-auto --enable-local-tool-synthesis --no-mcp`
2. Request functionality that requires a new tool
3. System creates scaffold automatically
4. Implement the tool in `tools/<toolname>/src/index.js`
5. Test the implementation
6. Tool is now available for use

### For Developers

1. Add tests for scaffold generation in test suite
2. Ensure manifest updates are atomic
3. Validate tool name safety
4. Test with and without synthesis enabled
5. Verify no MCP connections when flag is set

## Security Considerations

- **Local Only**: No network calls for tool discovery or execution
- **Explicit Activation**: Users must opt in explicitly
- **No Auto-Execution**: Scaffolded tools fail safely with clear messages
- **File System Safety**: All file operations use safe path handling
- **Validation**: Tool names and paths are validated before creation

## Future Enhancements

Potential future additions (not in initial implementation):
- Tool versioning and updates
- Shared tool libraries
- Template customization
- Auto-implementation hints based on description
- Testing framework integration
- Tool documentation generation

## Compatibility

- **Minimum Node.js**: 22.0.0
- **Operating Systems**: Linux, macOS, Windows
- **Backward Compatible**: Default behavior unchanged
- **Forward Compatible**: Registry format designed for extension

## Examples

### Enable both flags together (recommended)
```bash
copilot-auto --enable-local-tool-synthesis --no-mcp "Create a tool to parse JSON"
```

### Using environment variables
```bash
export COPILOT_LOCAL_TOOL_SYNTHESIS=1
export COPILOT_NO_MCP=1
copilot-auto "Process this data"
```

### Default behavior (no change)
```bash
copilot-auto "Normal usage without synthesis"
# No scaffolding occurs, normal error handling applies
```

## Support and Feedback

This is an experimental feature. Please report issues and provide feedback to help us improve the local tool synthesis experience.
