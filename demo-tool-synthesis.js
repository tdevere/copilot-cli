#!/usr/bin/env node

/**
 * Demo script for local tool synthesis feature
 * Shows the tool scaffolding in action
 */

import { readFile, writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';

const TOOLS_DIR = 'tools';
const MANIFEST_FILE = join(TOOLS_DIR, 'manifest.json');

// Import ToolSynthesizer from index.js
async function loadModule() {
  const indexContent = await readFile('index.js', 'utf8');
  
  // Extract ToolSynthesizer class
  // For demo, we'll recreate it inline
  class ToolSynthesizer {
    constructor() {
      this.manifestPath = MANIFEST_FILE;
    }

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
      
      if (await this.toolExists(sanitizedName)) {
        console.log(`ℹ Tool '${sanitizedName}' already exists. Skipping scaffold.`);
        return sanitizedName;
      }

      const toolDir = join(TOOLS_DIR, sanitizedName);
      const toolSrcDir = join(toolDir, 'src');
      
      await mkdir(toolDir, { recursive: true });
      await mkdir(toolSrcDir, { recursive: true });

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
  
  return ToolSynthesizer;
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        🔬 Local Tool Synthesis Demo 🔬                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);

  // Clean up any existing demo tools
  console.log('🧹 Cleaning up previous demo artifacts...');
  try {
    await rm(TOOLS_DIR, { recursive: true, force: true });
  } catch (error) {
    // Ignore
  }
  
  const ToolSynthesizer = await loadModule();
  const synthesizer = new ToolSynthesizer();

  console.log('\n📝 Demonstrating tool synthesis...\n');
  console.log('Scenario: Request a tool that doesn\'t exist yet\n');

  // Demo 1: Create a JSON parser tool
  console.log('1️⃣  Creating "json-parser" tool scaffold...');
  await synthesizer.scaffoldTool('json-parser', 'Parse and validate JSON data');

  // Demo 2: Create a CSV converter tool
  console.log('2️⃣  Creating "csv-converter" tool scaffold...');
  await synthesizer.scaffoldTool('csv-converter', 'Convert CSV files to JSON format');

  // Demo 3: Try to create duplicate (should skip)
  console.log('3️⃣  Attempting to create duplicate "json-parser" (should skip)...');
  await synthesizer.scaffoldTool('json-parser', 'Duplicate test');

  // Demo 4: Show tool name validation
  console.log('\n4️⃣  Testing tool name validation...');
  const validated = synthesizer.validateToolName('My Special Tool!');
  console.log(`   Input: "My Special Tool!" → Output: "${validated}"\n`);

  // Show manifest contents
  console.log('📋 Final manifest contents:');
  console.log('─'.repeat(60));
  const manifest = await synthesizer.loadManifest();
  console.log(JSON.stringify(manifest, null, 2));
  console.log('─'.repeat(60));

  // Show directory structure
  console.log('\n📂 Created directory structure:');
  console.log(`
tools/
├── manifest.json
├── json-parser/
│   ├── tool.md
│   └── src/
│       └── index.js
└── csv-converter/
    ├── tool.md
    └── src/
        └── index.js
  `);

  console.log('✅ Demo complete!');
  console.log('\n💡 To clean up demo artifacts: rm -rf tools\n');
  
  console.log('📚 Usage Examples:');
  console.log('   # Enable synthesis with MCP prevention');
  console.log('   copilot-auto --enable-local-tool-synthesis --no-mcp "Process data"');
  console.log('   ');
  console.log('   # Using environment variables');
  console.log('   export COPILOT_LOCAL_TOOL_SYNTHESIS=1');
  console.log('   export COPILOT_NO_MCP=1');
  console.log('   copilot-auto "Build custom tools"\n');
}

main().catch(console.error);
