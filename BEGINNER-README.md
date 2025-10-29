# Copilot CLI Auto-Approval Wrapper 🤖

A powerful automation tool that wraps GitHub Copilot CLI to enable hands-free, autonomous coding sessions with built-in safety controls.

## What Does This Do?

This tool lets GitHub Copilot CLI run on **autopilot** - it automatically approves all actions so Copilot can complete complex tasks without you having to constantly click "yes" or "approve". Think of it like setting Copilot to cruise control!

Perfect for:
- 🏗️ Building entire features or projects autonomously
- 🔧 Large-scale refactoring operations
- 🧪 Generating comprehensive test suites
- 📝 Creating documentation across multiple files
- 🔄 Repetitive coding tasks that require many steps

## Prerequisites (What You Need First)

Before using this tool, you need to have:

### 1. **Node.js** (version 22 or higher)
Node.js is the JavaScript runtime that lets you run this tool.

**How to check if you have it:**
```bash
node --version
```

**How to install it:**
- Download from [nodejs.org](https://nodejs.org/)
- Choose the "LTS" version (Long Term Support)
- Follow the installer instructions

### 2. **npm** (version 10 or higher)
npm is the package manager that comes with Node.js. It should be installed automatically when you install Node.js.

**How to check:**
```bash
npm --version
```

### 3. **GitHub Copilot CLI**
This is the official GitHub Copilot command-line tool. Our wrapper enhances it.

**How to install:**
```bash
npm install -g @github/copilot
```

### 4. **Active GitHub Copilot Subscription**
You need a paid GitHub Copilot subscription.
- Check [GitHub Copilot Plans](https://github.com/features/copilot/plans)
- If you have access through your organization, make sure CLI access is enabled

### 5. **GitHub Authentication**
You need to be logged in to GitHub.

**First time setup:**
```bash
copilot
```
Then use the `/login` command and follow the prompts.

**Alternative - Using a Personal Access Token (PAT):**
1. Go to https://github.com/settings/personal-access-tokens/new
2. Click "add permissions" and select "Copilot Requests"
3. Generate the token
4. Set it as an environment variable:
   ```bash
   # On Windows (PowerShell)
   $env:GITHUB_TOKEN="your_token_here"
   
   # On Mac/Linux
   export GITHUB_TOKEN="your_token_here"
   ```

## Installation

### Step 1: Get the Code

**Option A: Clone this repository**
```bash
git clone <your-repo-url>
cd copilot-cli-auto
```

**Option B: Download as ZIP**
- Click the green "Code" button on GitHub
- Select "Download ZIP"
- Extract it to a folder
- Open terminal/command prompt in that folder

### Step 2: Install Dependencies

In the project folder, run:
```bash
npm install
```

This reads the `package.json` file and installs everything the tool needs.

### Step 3: Install Globally (Optional but Recommended)

This lets you run `copilot-auto` from anywhere on your computer:

```bash
npm install -g .
```

Or use the shortcut:
```bash
npm run install-global
```

**Note:** You might need administrator/sudo permissions:
- **Windows:** Run PowerShell as Administrator
- **Mac/Linux:** Use `sudo npm install -g .`

## How to Use It

### Basic Usage

**Interactive Mode** (like a chat session):
```bash
copilot-auto
```

This opens an interactive session where you can have a back-and-forth conversation with Copilot. All actions are automatically approved.

**Direct Mode** (give it a task and let it work):
```bash
copilot-auto "Create a REST API with Express.js and add tests"
```

This runs the task and exits when complete.

### Common Examples

**1. Build a complete feature:**
```bash
copilot-auto "Create a user authentication system with login, signup, and password reset"
```

**2. Refactor existing code:**
```bash
copilot-auto "Refactor all JavaScript files to use ES6 modules and add JSDoc comments"
```

**3. Generate tests:**
```bash
copilot-auto "Create comprehensive unit tests for all functions in the src folder"
```

**4. Create documentation:**
```bash
copilot-auto "Generate README.md files for each module explaining what it does"
```

**5. Set up a new project:**
```bash
copilot-auto "Initialize a React project with TypeScript, ESLint, and Prettier configured"
```

### Safety Controls

The tool has built-in limits to prevent runaway operations:

**Set maximum iterations** (how many steps it can take):
```bash
copilot-auto --max-iterations 100 "Build a blog application"
```

**Set maximum time** (in milliseconds):
```bash
copilot-auto --max-duration 1800000 "Refactor the entire codebase"
```
(1800000 ms = 30 minutes)

**Deny specific dangerous operations:**
```bash
copilot-auto --deny-tool "shell(rm -rf)" --deny-tool "shell(git push)" "Clean up old files"
```

**Choose a different AI model:**
```bash
copilot-auto --model gpt-5 "Explain this codebase"
```

## Configuration File

Instead of typing options every time, create a configuration file that sets your defaults.

**Create a file at:** `~/.copilot-auto-config.json`

**Location by OS:**
- **Windows:** `C:\Users\YourUsername\.copilot-auto-config.json`
- **Mac/Linux:** `/Users/YourUsername/.copilot-auto-config.json` or `~/.copilot-auto-config.json`

**Example configuration:**
```json
{
  "maxIterations": 50,
  "maxDuration": 1800000,
  "allowAllTools": true,
  "allowAllPaths": false,
  "autoApprove": true,
  "deniedTools": [
    "shell(rm -rf)",
    "shell(git push --force)"
  ],
  "model": "claude-sonnet-4.5"
}
```

**What each setting means:**
- `maxIterations`: Maximum number of steps Copilot can take (default: 50)
- `maxDuration`: Maximum time in milliseconds (default: 1,800,000 = 30 minutes)
- `allowAllTools`: Let Copilot use any tool it needs (default: true)
- `allowAllPaths`: Let Copilot access any file path (default: false for safety)
- `autoApprove`: Automatically approve all actions (default: true)
- `deniedTools`: List of specific commands to block
- `model`: Which AI model to use (default: "claude-sonnet-4.5")

## Understanding the Output

When you run `copilot-auto`, you'll see:

```
🤖 Starting Copilot CLI with auto-approval
📊 Limits: 50 iterations, 1800s duration
🔧 Allow all tools: true
🔧 Allow all paths: false

Running: copilot --model claude-sonnet-4.5 --allow-all-tools -p "Your prompt"
```

**Status indicators:**
- `✓` = Success, operation completed
- `⚠` = Warning, limit reached or issue detected
- `🛑` = Stopped by user or system
- `[AUTO-APPROVED]` = An action was automatically approved

**Final summary:**
```
✓ Copilot CLI exited with code 0
📊 Total iterations: 27
⏱  Duration: 145.3s
```

## Troubleshooting

### "Command not found: copilot-auto"

**Solution:** You haven't installed it globally. Run:
```bash
npm install -g .
```
Or use it directly with:
```bash
node index.js "your prompt"
```

### "Command not found: copilot"

**Solution:** You need to install GitHub Copilot CLI first:
```bash
npm install -g @github/copilot
```

### "Authentication required"

**Solution:** Log in to GitHub:
```bash
copilot
```
Then type `/login` and follow the instructions.

### "Maximum iterations reached"

**Solution:** Increase the limit:
```bash
copilot-auto --max-iterations 200 "your prompt"
```

### Operation is taking too long

**Solution:** Increase the duration limit:
```bash
copilot-auto --max-duration 3600000 "your prompt"
```
(3600000 ms = 1 hour)

### Copilot is doing something dangerous

**Solution:** Press `Ctrl+C` to stop immediately. Then add denied tools:
```bash
copilot-auto --deny-tool "shell(dangerous-command)" "your prompt"
```

## Safety Best Practices

⚠️ **Important Safety Tips:**

1. **Start in a test directory** - Don't run this on your main codebase until you're comfortable with how it works
2. **Use version control** - Always have your code in git so you can undo changes:
   ```bash
   git init
   git add .
   git commit -m "Before copilot-auto"
   ```
3. **Set conservative limits** - Start with low iteration counts (10-20) until you trust it
4. **Deny dangerous operations** - Block commands like `rm -rf`, `git push --force`, etc.
5. **Monitor the first few runs** - Watch what it does so you understand its behavior
6. **Use `allowAllPaths: false`** - This prevents access to files outside your project

## Advanced Usage

### Running Tests

The project includes built-in tests:
```bash
npm test
```

### See Examples

Run example scenarios:
```bash
npm run examples
```

### Quick Start Guide

Interactive tutorial:
```bash
npm run quickstart
```

### Uninstall

If you want to remove the global installation:
```bash
npm uninstall -g copilot-cli-auto
```

Or use the shortcut:
```bash
npm run uninstall
```

## How It Works (Behind the Scenes)

This tool is a wrapper around GitHub Copilot CLI. Here's what happens:

1. **You run `copilot-auto "your task"`**
2. The wrapper starts GitHub Copilot CLI with special flags:
   - `--allow-all-tools` = Gives Copilot permission to use all tools
   - `--model` = Specifies which AI to use
   - `--allow-all-paths` = (Optional) Allows file access everywhere
3. **As Copilot works**, the wrapper:
   - Automatically approves any confirmation prompts
   - Counts iterations and tracks time
   - Enforces your safety limits
4. **When complete**, it shows you a summary of what was done

The original Copilot CLI requires you to manually approve each action. This wrapper automates those approvals while adding safety rails.

## Getting Help

**View all options:**
```bash
copilot-auto --help
```

**Check version:**
```bash
copilot-auto --version
```

**Get help with Copilot CLI:**
```bash
copilot --help
```

## Tips for Beginners

1. **Start small** - Try simple tasks first like "Create a hello world function"
2. **Be specific** - The more detailed your prompt, the better the results
3. **Review the output** - After it finishes, check what was created/modified
4. **Iterate** - If it doesn't get it right, run it again with clarifications
5. **Learn from it** - Read the code it generates to understand patterns
6. **Use version control** - Git is your friend - commit often!

## Example Workflow

Here's a complete workflow for creating a new project:

```bash
# 1. Create and enter a new directory
mkdir my-project
cd my-project

# 2. Initialize git for safety
git init

# 3. Run copilot-auto with a detailed prompt
copilot-auto "Create a Node.js REST API with the following features:
- Express.js web server
- User registration and login endpoints
- PostgreSQL database connection
- Input validation middleware
- Error handling
- Basic unit tests with Jest
- README with API documentation"

# 4. Review what was created
ls -la

# 5. Check if it works
npm install
npm test
npm start

# 6. Commit the results
git add .
git commit -m "Initial project setup by Copilot"
```

## License

MIT License - feel free to use, modify, and share!

## Questions?

If something isn't working or you need help:
1. Check the troubleshooting section above
2. Review the GitHub Copilot CLI docs: https://docs.github.com/copilot/concepts/agents/about-copilot-cli
3. Check your authentication and subscription status
4. Make sure all prerequisites are installed

Happy coding! 🚀
