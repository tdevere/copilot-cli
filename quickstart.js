#!/usr/bin/env node

console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║  🤖  COPILOT CLI AUTO-APPROVAL WRAPPER - QUICK START  🚀          ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

✅ INSTALLATION COMPLETE!

Your wrapper is installed and ready to use.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 QUICK START - Try these commands:

  1. Simple task:
     $ copilot-auto "Create a package.json for a new Node project"

  2. With safety limits:
     $ copilot-auto --max-iterations 20 "Add error handling to all JS files"

  3. Interactive mode:
     $ copilot-auto

  4. View examples:
     $ npm run examples

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 DOCUMENTATION:

  • Quick reference:  copilot-auto --help
  • Full docs:        AUTO-WRAPPER-README.md
  • Installation:     INSTALLATION.md
  • Summary:          SUMMARY.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️  CONFIGURATION (Optional):

  Create ~/.copilot-auto-config.json to customize:
  
  {
    "maxIterations": 100,
    "maxDuration": 3600000,
    "deniedTools": [
      "shell(git push)",
      "shell(npm publish)"
    ],
    "model": "claude-sonnet-4.5"
  }

  See .copilot-auto-config.example.json for reference

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛡️  SAFETY TIPS:

  ✓ Start with --max-iterations 10-20 for first use
  ✓ Always work in a git repository
  ✓ Use --deny-tool for dangerous operations
  ✓ Review changes after completion
  ✓ Check logs at ~/.copilot/logs/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Ready to go! Start with a simple task to get familiar:

   $ copilot-auto "explain what files are in this directory"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
