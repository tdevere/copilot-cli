# 🎉 Welcome to Copilot CLI Auto-Approval Wrapper!

This tool lets GitHub Copilot CLI run autonomously - completing complex coding tasks without constant approvals.

## 🚀 New Here? Start with These Guides:

1. **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in 5 minutes
2. **[BEGINNER-README.md](BEGINNER-README.md)** - Complete guide with detailed explanations
3. **[GITHUB-SETUP.md](GITHUB-SETUP.md)** - How to share this repository

## 📖 What You'll Find Here:

- **index.js** - The main wrapper that makes Copilot autonomous
- **package.json** - Configuration for npm installation
- **.copilot-auto-config.example.json** - Example config file
- **Comprehensive Docs** - Everything explained for beginners

## ⚡ Quick Install

```bash
# Prerequisites: Node.js 22+, GitHub Copilot CLI
npm install -g @github/copilot

# Install this wrapper
git clone <your-repo-url>
cd copilot-cli-auto
npm install
npm install -g .

# Try it!
copilot-auto "Create a simple web server"
```

## 🎯 What It Does

Instead of clicking "approve" for every action Copilot wants to take, this wrapper:
- ✅ Automatically approves all actions
- ✅ Enforces safety limits (max iterations, time)
- ✅ Blocks dangerous operations (optional)
- ✅ Tracks progress and provides summaries

Perfect for building entire features, refactoring code, or generating comprehensive test suites!

## 📚 Full Documentation

- **[BEGINNER-README.md](BEGINNER-README.md)** - Complete beginner's guide
- **[QUICKSTART.md](QUICKSTART.md)** - Fast 5-minute setup
- **[SHARING-GUIDE.md](SHARING-GUIDE.md)** - How to push to GitHub
- **[GITHUB-SETUP.md](GITHUB-SETUP.md)** - Repository setup instructions

## ⚠️ Safety First!

Always work in git repositories so you can undo changes:
```bash
git init
git add .
git commit -m "Before copilot-auto"
```

Set conservative limits while learning:
```bash
copilot-auto --max-iterations 20 "your task"
```

Deny dangerous operations:
```bash
copilot-auto --deny-tool "shell(rm -rf)" "your task"
```

## 💡 Example Tasks

```bash
# Simple tasks
copilot-auto "Create a sorting algorithm with tests"

# Build features
copilot-auto "Create a REST API with user authentication"

# Refactoring
copilot-auto "Add TypeScript types to all JavaScript files"

# Testing
copilot-auto "Generate unit tests for the entire codebase"

# Documentation
copilot-auto "Create README files for each module"
```

## 🤝 Need Help?

1. Check **[BEGINNER-README.md](BEGINNER-README.md)** - Detailed troubleshooting
2. Review **[QUICKSTART.md](QUICKSTART.md)** - Common issues and solutions
3. Open an issue on GitHub

## 📄 License

MIT License - Use freely, modify as needed, share with friends!

---

**Ready to start?** → [Open QUICKSTART.md](QUICKSTART.md) 🚀
