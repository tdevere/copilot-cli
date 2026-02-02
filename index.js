#!/usr/bin/env node

import { spawn, execSync } from 'child_process';
import { readFile, writeFile, mkdir, access, readdir, stat } from 'fs/promises';
import { homedir } from 'os';
import { join, resolve } from 'path';
import { constants } from 'fs';

const CONFIG_FILE = join(homedir(), '.copilot-auto-config.json');
const TOOLS_DIR = 'tools';
const MANIFEST_FILE = join(TOOLS_DIR, 'manifest.json');
const SESSION_STATE_DIR = '.copilot-auto';
const SESSION_STATE_FILE = 'session-state.json';
const COPILOT_SESSION_DIR = join(homedir(), '.copilot', 'session-state');

// Default configuration
const DEFAULT_CONFIG = {
  maxIterations: 50,
  maxTokens: 100000,
  maxDuration: 30 * 60 * 1000, // 30 minutes
  allowAllTools: true,
  allowAllPaths: false,
  autoApprove: true,
  allowedTools: [],
  deniedTools: [],
  model: 'claude-sonnet-4.5',
  enableLocalToolSynthesis: false,
  noMcp: false,
  session: {
    enabled: false,
    mode: 'continue'
  }
};

// Session Management Module
class SessionManager {
  constructor() {
    this.repoRoot = this.getRepoRoot();
    this.stateDir = join(this.repoRoot, SESSION_STATE_DIR);
    this.stateFile = join(this.stateDir, SESSION_STATE_FILE);
  }

  getRepoRoot() {
    try {
      const result = execSync('git rev-parse --show-toplevel', { 
        encoding: 'utf8', 
        stdio: ['pipe', 'pipe', 'pipe'] 
      });
      return result.trim();
    } catch {
      return process.cwd();
    }
  }

  async ensureStateDirectory() {
    try {
      await mkdir(this.stateDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }

  async loadState() {
    try {
      await access(this.stateFile, constants.F_OK);
      const data = await readFile(this.stateFile, 'utf8');
      return JSON.parse(data);
    } catch {
      return {
        repoRoot: this.repoRoot,
        lastSessionId: null,
        lastUsedAt: null,
        copilotVersion: null
      };
    }
  }

  async saveState(sessionId = null) {
    await this.ensureStateDirectory();
    const state = {
      repoRoot: this.repoRoot,
      lastSessionId: sessionId,
      lastUsedAt: new Date().toISOString(),
      copilotVersion: await this.getCopilotVersion()
    };
    await writeFile(this.stateFile, JSON.stringify(state, null, 2), 'utf8');
    return state;
  }

  async getCopilotVersion() {
    try {
      const result = execSync('copilot --version', { 
        encoding: 'utf8', 
        stdio: ['pipe', 'pipe', 'pipe'] 
      });
      return result.trim();
    } catch {
      return null;
    }
  }

  async findRecentSession() {
    try {
      await access(COPILOT_SESSION_DIR, constants.F_OK);
      const entries = await readdir(COPILOT_SESSION_DIR);
      
      const sessions = [];
      for (const entry of entries) {
        const sessionPath = join(COPILOT_SESSION_DIR, entry);
        const stats = await stat(sessionPath);
        if (stats.isDirectory()) {
          sessions.push({
            id: entry,
            path: sessionPath,
            mtime: stats.mtime
          });
        }
      }
      
      // Sort by modification time (most recent first)
      sessions.sort((a, b) => b.mtime - a.mtime);
      
      // Try to find a session for this repo by checking plan.md content
      for (const session of sessions) {
        const planPath = join(session.path, 'plan.md');
        try {
          await access(planPath, constants.F_OK);
          const planContent = await readFile(planPath, 'utf8');
          if (planContent.includes(this.repoRoot) || 
              planContent.toLowerCase().includes(this.repoRoot.toLowerCase().replace(/\\/g, '/'))) {
            return session.id;
          }
        } catch {
          // No plan.md or can't read, continue
        }
      }
      
      // If no repo-specific session found, return most recent
      return sessions.length > 0 ? sessions[0].id : null;
    } catch {
      return null;
    }
  }

  async getLastSessionId() {
    const state = await this.loadState();
    if (state.lastSessionId) {
      return state.lastSessionId;
    }
    return await this.findRecentSession();
  }
}

// Tool Synthesis Module
class ToolSynthesizer {
  constructor() {
    this.manifestPath = MANIFEST_FILE;
  }

  // Validate and sanitize tool name
  validateToolName(name) {
    const sanitized = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!/^[a-z][a-z0-9-]*$/.test(sanitized)) {
      throw new Error(`Invalid tool name: ${name}`);
    }
    return sanitized;
  }

  async ensureToolsDirectory() {
    try {
      await mkdir(TOOLS_DIR, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }

  async loadManifest() {
    try {
      await access(this.manifestPath, constants.F_OK);
      const data = await readFile(this.manifestPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {
        version: '1.0.0',
        tools: {}
      };
    }
  }

  async saveManifest(manifest) {
    await writeFile(this.manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  }

  async toolExists(toolName) {
    const manifest = await this.loadManifest();
    return toolName in manifest.tools;
  }

  async scaffoldTool(toolName, description = 'Auto-generated tool scaffold') {
    await this.ensureToolsDirectory();
    
    const sanitizedName = this.validateToolName(toolName);
    
    // Check if tool already exists
    if (await this.toolExists(sanitizedName)) {
      console.log(`ℹ Tool '${sanitizedName}' already exists. Skipping scaffold.`);
      return sanitizedName;
    }

    const toolDir = join(TOOLS_DIR, sanitizedName);
    const toolSrcDir = join(toolDir, 'src');
    
    // Create directories
    await mkdir(toolDir, { recursive: true });
    await mkdir(toolSrcDir, { recursive: true });

    // Create tool.md specification
    const toolMdContent = `# Tool: ${sanitizedName}

## Status
**Scaffold** - Implementation needed

## Purpose
${description}

## Parameters
[Expected input parameters and their types]

## Implementation Notes
This is a scaffolded tool. To complete implementation:
1. Edit \`src/index.js\` with actual functionality
2. Add tests in \`tests/\` directory
3. Update status in \`tools/manifest.json\` to "implemented"
4. Test thoroughly before use

## Usage Example
[How to invoke this tool once implemented]

Created: ${new Date().toISOString()}
`;
    await writeFile(join(toolDir, 'tool.md'), toolMdContent, 'utf8');

    // Create stub implementation
    const stubContent = `#!/usr/bin/env node

/**
 * Auto-generated tool scaffold
 * Tool: ${sanitizedName}
 * Created: ${new Date().toISOString()}
 * 
 * TODO: Implement actual functionality
 */

console.error('Tool scaffold created locally. Implement me.');
console.error('Edit: tools/${sanitizedName}/src/index.js');
process.exit(1);
`;
    await writeFile(join(toolSrcDir, 'index.js'), stubContent, 'utf8');

    // Update manifest
    const manifest = await this.loadManifest();
    manifest.tools[sanitizedName] = {
      name: sanitizedName,
      description: description,
      command: 'node',
      args: [`tools/${sanitizedName}/src/index.js`],
      schema: {
        parameters: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      createdAt: new Date().toISOString(),
      status: 'scaffold'
    };
    await this.saveManifest(manifest);

    console.log(`\n✓ Tool scaffold created: ${sanitizedName}`);
    console.log(`  📄 Spec: ${join(toolDir, 'tool.md')}`);
    console.log(`  💻 Code: ${join(toolSrcDir, 'index.js')}`);
    console.log(`  📋 Registry: ${this.manifestPath}\n`);

    return sanitizedName;
  }
}

class CopilotAutoWrapper {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.iterations = 0;
    this.startTime = Date.now();
    this.tokenCount = 0;
    this.sessionActive = false;
    this.toolSynthesizer = new ToolSynthesizer();
    this.sessionManager = new SessionManager();
    this.sessionMode = null;
    this.resumeSessionId = null;
    this.currentSessionId = null;
  }

  async loadConfig() {
    try {
      const configData = await readFile(CONFIG_FILE, 'utf8');
      const userConfig = JSON.parse(configData);
      this.config = { ...this.config, ...userConfig };
      console.log('✓ Loaded configuration from', CONFIG_FILE);
    } catch (error) {
      console.log('ℹ Using default configuration (no config file found)');
    }
    
    // Apply environment variable overrides
    if (process.env.COPILOT_LOCAL_TOOL_SYNTHESIS) {
      const val = process.env.COPILOT_LOCAL_TOOL_SYNTHESIS.toLowerCase();
      this.config.enableLocalToolSynthesis = ['1', 'true', 'yes', 'on'].includes(val);
    }
    
    if (process.env.COPILOT_NO_MCP) {
      const val = process.env.COPILOT_NO_MCP.toLowerCase();
      this.config.noMcp = ['1', 'true', 'yes', 'on'].includes(val);
    }
  }

  checkLimits() {
    const elapsed = Date.now() - this.startTime;
    
    if (this.iterations >= this.config.maxIterations) {
      console.log(`\n⚠ Maximum iterations (${this.config.maxIterations}) reached. Stopping.`);
      return false;
    }
    
    if (elapsed >= this.config.maxDuration) {
      console.log(`\n⚠ Maximum duration (${this.config.maxDuration}ms) reached. Stopping.`);
      return false;
    }
    
    return true;
  }

  buildCopilotCommand(userPrompt) {
    const args = [];
    
    // Handle session flags first
    if (this.sessionMode === 'continue' && this.config.session.enabled) {
      args.push('--continue');
      console.log('📝 Continuing previous session');
    } else if (this.sessionMode === 'resume' && this.config.session.enabled) {
      args.push('--resume');
      if (this.resumeSessionId) {
        args.push(this.resumeSessionId);
        console.log(`📝 Resuming session: ${this.resumeSessionId}`);
      } else {
        console.log('📝 Resume mode: interactive picker');
      }
    }
    
    // Add model
    if (this.config.model) {
      args.push('--model', this.config.model);
    }
    
    // Add tool permissions
    if (this.config.allowAllTools) {
      args.push('--allow-all-tools');
    }
    
    if (this.config.allowAllPaths) {
      args.push('--allow-all-paths');
    }
    
    // Add allowed tools
    for (const tool of this.config.allowedTools) {
      args.push('--allow-tool', tool);
    }
    
    // Add denied tools
    for (const tool of this.config.deniedTools) {
      args.push('--deny-tool', tool);
    }
    
    // Add prompt if provided
    if (userPrompt) {
      args.push('-p', `"${userPrompt.replace(/"/g, '\\"')}"`);
    }
    
    return args;
  }

  async runInteractive(initialPrompt) {
    await this.loadConfig();
    
    // Set up session if needed
    if (this.config.session.enabled) {
      if (this.sessionMode === 'continue') {
        const sessionId = await this.sessionManager.getLastSessionId();
        if (sessionId) {
          this.resumeSessionId = sessionId;
          console.log(`✓ Found session to continue: ${sessionId.substring(0, 8)}...`);
        }
      } else if (this.sessionMode === 'resume' && !this.resumeSessionId) {
        const sessionId = await this.sessionManager.getLastSessionId();
        if (sessionId) {
          this.resumeSessionId = sessionId;
          console.log(`✓ Found session to resume: ${sessionId.substring(0, 8)}...`);
        }
      }
    }
    
    console.log('🤖 Starting Copilot CLI with auto-approval');
    console.log(`📊 Limits: ${this.config.maxIterations} iterations, ${this.config.maxDuration / 1000}s duration`);
    console.log(`🔧 Allow all tools: ${this.config.allowAllTools}`);
    console.log(`🔧 Allow all paths: ${this.config.allowAllPaths}`);
    if (this.config.session.enabled) {
      console.log(`📂 Session management: enabled`);
    }
    if (this.config.enableLocalToolSynthesis) {
      console.log(`🔬 Local tool synthesis: enabled`);
    }
    if (this.config.noMcp) {
      console.log(`🚫 MCP servers: disabled`);
    }
    console.log('');

    const args = this.buildCopilotCommand(initialPrompt);
    const command = `copilot ${args.join(' ')}`;
    
    console.log(`Running: ${command}\n`);
    
    const copilot = spawn(command, [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    this.sessionActive = true;
    
    copilot.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(output);
      
      this.iterations++;
      
      // Extract session ID from output (format: "Session folder: ~/.copilot/session-state/SESSION_ID")
      const sessionMatch = output.match(/Session folder:.*?session-state[\/\\]([a-f0-9-]+)/i);
      if (sessionMatch) {
        this.currentSessionId = sessionMatch[1];
      }
      
      // Check if we need to respond to any prompts
      // The CLI with --allow-all-tools shouldn't prompt, but just in case
      if (this.config.autoApprove) {
        if (output.includes('Do you want to') || 
            output.includes('Continue?') || 
            output.includes('Approve?')) {
          console.log('\n[AUTO-APPROVED]');
          copilot.stdin.write('yes\n');
        }
      }
      
      // Check limits after each output
      if (!this.checkLimits()) {
        this.stop(copilot);
      }
    });

    copilot.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    copilot.on('close', async (code) => {
      this.sessionActive = false;
      console.log(`\n✓ Copilot CLI exited with code ${code}`);
      console.log(`📊 Total iterations: ${this.iterations}`);
      console.log(`⏱  Duration: ${((Date.now() - this.startTime) / 1000).toFixed(1)}s`);
      
      if (this.config.session.enabled) {
        try {
          await this.sessionManager.saveState(this.currentSessionId);
          console.log(`📂 Session state saved to ${this.sessionManager.stateFile}`);
          if (this.currentSessionId) {
            console.log(`📝 Session ID: ${this.currentSessionId.substring(0, 8)}...`);
          }
        } catch (error) {
          console.error(`⚠️  Failed to save session state: ${error.message}`);
        }
      }
    });

    copilot.on('error', (error) => {
      console.error('Error spawning copilot:', error.message);
      process.exit(1);
    });

    // Handle Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n\n⚠ Interrupted by user');
      this.stop(copilot);
    });
  }

  stop(copilot) {
    if (this.sessionActive && copilot) {
      console.log('\n🛑 Stopping Copilot CLI...');
      copilot.kill('SIGTERM');
      setTimeout(() => {
        if (this.sessionActive) {
          copilot.kill('SIGKILL');
        }
      }, 2000);
    }
  }

  async runDirect(prompt) {
    await this.loadConfig();
    
    console.log('🤖 Running Copilot CLI in direct mode');
    console.log(`📝 Prompt: "${prompt}"\n`);

    const args = this.buildCopilotCommand(prompt);
    const command = `copilot ${args.join(' ')}`;
    
    return new Promise((resolve, reject) => {
      const copilot = spawn(command, [], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });
      
      // Capture stdout to extract session ID and display output
      copilot.stdout.on('data', (data) => {
        const output = data.toString();
        process.stdout.write(output);
        
        // Extract session ID from output
        const sessionMatch = output.match(/Session folder:.*?session-state[\/\\]([a-f0-9-]+)/i);
        if (sessionMatch) {
          this.currentSessionId = sessionMatch[1];
        }
      });
      
      copilot.stderr.on('data', (data) => {
        process.stderr.write(data);
      });

      copilot.on('close', async (code) => {
        // Save session state if enabled
        if (this.config.session.enabled) {
          try {
            // If we didn't capture session ID from output, find it by timestamp
            if (!this.currentSessionId) {
              this.currentSessionId = await this.sessionManager.findRecentSession();
            }
            
            await this.sessionManager.saveState(this.currentSessionId);
            console.log(`\n📂 Session state saved to ${this.sessionManager.stateFile}`);
            if (this.currentSessionId) {
              console.log(`📝 Session ID: ${this.currentSessionId.substring(0, 8)}...`);
            }
          } catch (error) {
            console.error(`⚠️  Failed to save session state: ${error.message}`);
          }
        }
        
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Copilot exited with code ${code}`));
        }
      });

      copilot.on('error', (error) => {
        reject(error);
      });
    });
  }
}

// CLI Interface
function printHelp() {
  console.log(`
GitHub Copilot CLI Auto-Approval Wrapper

Usage: copilot-auto [options] [prompt]

Options:
  -h, --help                      Show this help message
  -v, --version                   Show version
  -c, --config <file>             Use custom config file
  --max-iterations <n>            Maximum number of iterations (default: 50)
  --max-duration <ms>             Maximum duration in milliseconds (default: 1800000)
  --model <model>                 AI model to use (default: claude-sonnet-4.5)
  --allow-all-paths               Allow access to all file paths
  --deny-tool <tool>              Deny specific tool (can be used multiple times)
  --interactive                   Start in interactive mode (default if no prompt given)
  --direct                        Run prompt and exit (default if prompt given)
  --enable-local-tool-synthesis   Enable local tool synthesis (default: false)
  --no-mcp                        Prevent all MCP server usage (default: false)

Session Management:
  -C, --continue                  Continue the most recent session for this repo
  --resume [sessionId]            Resume a specific session (or pick interactively)
  --enable-session                Enable session management (default: false)
  --session <name>                Session name/group identifier

Environment Variables:
  COPILOT_LOCAL_TOOL_SYNTHESIS=1  Enable local tool synthesis
  COPILOT_NO_MCP=1                Prevent MCP server usage

Examples:
  # Interactive mode with auto-approval
  copilot-auto

  # Direct mode with a prompt
  copilot-auto "Create a new React component"
  
  # Continue previous session
  copilot-auto --continue "Add more tests to the component"
  
  # Resume a specific session
  copilot-auto --resume "Complete the user authentication feature"

  # With custom limits
  copilot-auto --max-iterations 100 --max-duration 3600000

  # With specific model
  copilot-auto --model gpt-5 "Refactor this code"

  # Deny dangerous operations
  copilot-auto --deny-tool "shell(rm *)" --deny-tool "shell(git push)"
  
  # Enable local tool synthesis with MCP prevention (experimental)
  copilot-auto --enable-local-tool-synthesis --no-mcp "Create custom tools"

Configuration File:
  Create ~/.copilot-auto-config.json with:
  {
    "maxIterations": 50,
    "maxDuration": 1800000,
    "allowAllTools": true,
    "allowAllPaths": false,
    "deniedTools": [],
    "model": "claude-sonnet-4.5",
    "enableLocalToolSynthesis": false,
    "noMcp": false,
    "session": {
      "enabled": false,
      "mode": "continue"
    }
  }
`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(0);
  }
  
  if (args.includes('-v') || args.includes('--version')) {
    const pkg = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'));
    console.log(pkg.version);
    process.exit(0);
  }
  
  // Parse arguments
  const config = {};
  let prompt = null;
  let mode = null;
  let sessionMode = null;
  let resumeSessionId = null;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--max-iterations':
        config.maxIterations = parseInt(args[++i], 10);
        break;
      case '--max-duration':
        config.maxDuration = parseInt(args[++i], 10);
        break;
      case '--model':
        config.model = args[++i];
        break;
      case '--allow-all-paths':
        config.allowAllPaths = true;
        break;
      case '--deny-tool':
        config.deniedTools = config.deniedTools || [];
        config.deniedTools.push(args[++i]);
        break;
      case '--interactive':
        mode = 'interactive';
        break;
      case '--direct':
        mode = 'direct';
        break;
      case '--enable-local-tool-synthesis':
        config.enableLocalToolSynthesis = true;
        break;
      case '--no-mcp':
        config.noMcp = true;
        break;
      case '-C':
      case '--continue':
        config.session = config.session || {};
        config.session.enabled = true;
        sessionMode = 'continue';
        break;
      case '--resume':
        config.session = config.session || {};
        config.session.enabled = true;
        sessionMode = 'resume';
        if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
          resumeSessionId = args[++i];
        }
        break;
      case '--enable-session':
        config.session = config.session || {};
        config.session.enabled = true;
        break;
      case '--session':
        config.session = config.session || {};
        config.session.name = args[++i];
        break;
      default:
        if (!arg.startsWith('-')) {
          prompt = arg;
        }
    }
  }
  
  const wrapper = new CopilotAutoWrapper(config);
  
  if (sessionMode) {
    wrapper.sessionMode = sessionMode;
    wrapper.resumeSessionId = resumeSessionId;
  }
  
  // Determine mode if not specified
  if (!mode) {
    mode = prompt ? 'direct' : 'interactive';
  }
  
  if (mode === 'direct' && !prompt) {
    console.error('Error: Prompt required for direct mode');
    process.exit(1);
  }
  
  if (mode === 'interactive') {
    await wrapper.runInteractive(prompt);
  } else {
    await wrapper.runDirect(prompt);
  }
}

main().catch(console.error);
