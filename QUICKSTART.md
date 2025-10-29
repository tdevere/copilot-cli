# Quick Start Guide for Beginners 🚀

Follow these steps to get up and running in 5 minutes!

## Step 1: Check Your Prerequisites ✅

Open your terminal (PowerShell on Windows, Terminal on Mac/Linux) and run these commands:

```bash
# Check Node.js version (need 22 or higher)
node --version

# Check npm version (need 10 or higher)
npm --version
```

**Don't have Node.js?** Download from [nodejs.org](https://nodejs.org/) - get the LTS version.

## Step 2: Install GitHub Copilot CLI 🤖

```bash
npm install -g @github/copilot
```

Wait for it to finish installing...

## Step 3: Login to GitHub 🔐

```bash
copilot
```

When it opens, type:
```
/login
```

Follow the instructions to authenticate with GitHub. You'll need to:
1. Copy the code shown
2. Visit the link provided
3. Paste the code
4. Authorize the application

Type `/exit` to close Copilot CLI.

## Step 4: Get This Repository 📦

**Option A - If you have git:**
```bash
git clone <your-repo-url-here>
cd copilot-cli-auto
```

**Option B - No git:**
1. Click the green "Code" button on GitHub
2. Select "Download ZIP"
3. Extract the ZIP file
4. Open terminal in that folder

## Step 5: Install the Wrapper ⚙️

In the project folder, run:

```bash
# Install dependencies
npm install

# Install globally (you might need admin/sudo)
npm install -g .
```

**Windows users:** Right-click PowerShell → "Run as Administrator"
**Mac/Linux users:** Use `sudo npm install -g .`

## Step 6: Test It Out! 🎉

Create a test folder to try it safely:

```bash
# Create a test folder
mkdir copilot-test
cd copilot-test

# Initialize git (for safety - you can undo changes)
git init

# Try your first autonomous task!
copilot-auto "Create a simple Node.js web server using Express that responds with 'Hello World' on port 3000"
```

Watch as Copilot automatically:
- Creates the necessary files
- Writes the code
- Sets up package.json
- Installs dependencies

## Step 7: Check What It Created 👀

```bash
# List the files
ls

# Look at the code
cat server.js
# (or whatever file it created)

# Run it!
node server.js
```

## What to Try Next 🎯

Start with simple tasks and work your way up:

### Beginner Tasks:
```bash
copilot-auto "Create a function that sorts an array of numbers"
copilot-auto "Make a simple calculator with add, subtract, multiply, divide"
copilot-auto "Create a README.md explaining what this project does"
```

### Intermediate Tasks:
```bash
copilot-auto "Build a TODO list API with Express.js"
copilot-auto "Create unit tests for all the functions"
copilot-auto "Add input validation and error handling"
```

### Advanced Tasks:
```bash
copilot-auto "Build a complete user authentication system"
copilot-auto "Create a React app with routing and state management"
copilot-auto "Set up a full-stack app with database migrations"
```

## Pro Tips 💡

1. **Always use git** - Commit before running copilot-auto so you can undo
   ```bash
   git init
   git add .
   git commit -m "before copilot"
   ```

2. **Start in empty folders** - Don't risk your real projects until you're comfortable

3. **Be specific** - The more details you give, the better results:
   ```bash
   # ❌ Vague
   copilot-auto "make an app"
   
   # ✅ Specific  
   copilot-auto "Create a Node.js REST API with Express that has endpoints for creating, reading, updating and deleting users stored in a JSON file"
   ```

4. **Set limits** - Especially when learning:
   ```bash
   copilot-auto --max-iterations 20 "your task"
   ```

5. **Press Ctrl+C to stop** - If things go wrong, you can always interrupt

## Common Issues & Solutions 🔧

### "command not found: copilot-auto"
```bash
# Try installing globally again
npm install -g .

# Or run directly
node index.js "your prompt"
```

### "Permission denied" during global install
```bash
# Windows: Run PowerShell as Administrator
# Mac/Linux: Use sudo
sudo npm install -g .
```

### "Authentication required"
```bash
# Login again
copilot
# Then type: /login
```

### Nothing is happening
- Wait a bit - it might be working
- Check your internet connection
- Make sure Copilot CLI is installed: `copilot --version`

## Need More Help? 📚

Read the full [BEGINNER-README.md](./BEGINNER-README.md) for:
- Detailed explanations of every feature
- Safety best practices
- Configuration options
- Troubleshooting guide
- Advanced examples

## You're Ready! 🎊

You now have a powerful autonomous coding assistant. Start small, experiment safely, and gradually tackle bigger projects. Remember:
- Safety first (use git!)
- Be specific in your prompts
- Review what it creates
- Learn from the code it generates

Have fun building! 🚀
