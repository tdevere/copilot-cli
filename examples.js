#!/usr/bin/env node

/**
 * Example usage scripts for copilot-auto wrapper
 */

console.log(`
╔════════════════════════════════════════════════════════════════╗
║         Copilot CLI Auto-Approval Wrapper Examples            ║
╚════════════════════════════════════════════════════════════════╝

1. SIMPLE AUTO-EXECUTION
   Run a task with auto-approval:
   
   $ copilot-auto "Create a Node.js Express server with CRUD endpoints"

2. SAFE REFACTORING
   With limits and denied operations:
   
   $ copilot-auto \\
       --max-iterations 50 \\
       --deny-tool "shell(git push)" \\
       --deny-tool "shell(npm publish)" \\
       "Refactor this codebase to TypeScript"

3. INTERACTIVE MODE
   Start an interactive session with auto-approval:
   
   $ copilot-auto --max-iterations 200

4. CUSTOM CONFIG
   Create ~/.copilot-auto-config.json:
   
   {
     "maxIterations": 100,
     "maxDuration": 3600000,
     "allowAllTools": true,
     "allowAllPaths": false,
     "deniedTools": [
       "shell(rm -rf *)",
       "shell(git push --force)",
       "shell(npm publish)"
     ],
     "model": "claude-sonnet-4.5"
   }
   
   Then simply run: $ copilot-auto

5. DEBUGGING SESSION
   With increased limits for complex tasks:
   
   $ copilot-auto \\
       --max-iterations 150 \\
       --max-duration 7200000 \\
       "Find and fix all bugs in the application, add tests"

6. BATCH PROCESSING
   Process multiple files:
   
   $ copilot-auto "Add proper error handling to all JavaScript files"

7. DOCUMENTATION GENERATION
   Safe operation (no dangerous commands needed):
   
   $ copilot-auto "Generate comprehensive README and API docs"

8. CODE REVIEW ASSISTANT
   Analyze and improve code:
   
   $ copilot-auto "Review all code, suggest improvements, and refactor"

═══════════════════════════════════════════════════════════════════

💡 TIP: Always use --deny-tool for dangerous operations like:
   - shell(rm *)
   - shell(git push)
   - shell(npm publish)
   - shell(sudo *)

🛡️  SAFETY FIRST: Start with lower iteration counts and increase as needed.

📚 Full docs: See AUTO-WRAPPER-README.md
`);
