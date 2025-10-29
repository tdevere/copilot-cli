# ✅ RECOMMENDED TEST EXERCISE

## Quick Answer: Run This Command

The best way to validate the auto-prompt feature works is to run our automated test suite:

```bash
npm test
```

This runs 3 progressive tests that validate:
1. ✅ Basic file creation (single iteration)
2. ✅ Multi-step operations (multiple files)
3. ✅ Code generation (intelligent creation)

**Expected Result:**
```
✅ Test 1: Basic File Creation (9.5s)
✅ Test 2: Multi-Step File Creation (11.4s)
✅ Test 3: Code Generation (10.6s)

🎉 All tests passed! The auto-approval wrapper is working correctly.
```

---

## Manual Test Exercise (Recommended for First Use)

If you want hands-on validation, follow this progressive test sequence:

### 1️⃣ Basic Test (30 seconds)

Test basic auto-approval functionality:

```bash
copilot-auto --max-iterations 5 "Create hello.txt with the text 'It works!'"
```

**Verify:**
```bash
cat hello.txt  # Should show: It works!
```

**What this proves:**
- ✅ Wrapper spawns copilot correctly
- ✅ Auto-approval works (no prompts)
- ✅ Files are created successfully
- ✅ Process completes and exits

---

### 2️⃣ Multi-Step Test (1 minute)

Test multiple autonomous actions:

```bash
copilot-auto --max-iterations 15 \
  "Create a simple calculator.js file with add, subtract, multiply, and divide functions. Include JSDoc comments."
```

**Verify:**
```bash
cat calculator.js
node -e "const calc = require('./calculator'); console.log(calc.add(5, 3));"
```

**What this proves:**
- ✅ Handles complex multi-part tasks
- ✅ Generates working code
- ✅ Multiple iterations work correctly
- ✅ Intelligent understanding of requirements

---

### 3️⃣ Safety Limit Test (30 seconds)

Test that limits actually work:

```bash
copilot-auto --max-iterations 2 \
  "Create 10 different text files with unique content in each"
```

**Expected:** Process stops after 2 iterations

**What this proves:**
- ✅ Iteration limits are enforced
- ✅ Graceful shutdown works
- ✅ Safety features functional

---

### 4️⃣ Real-World Test (2-3 minutes)

Test a complete development workflow:

```bash
copilot-auto --max-iterations 20 \
  "Create a simple Express REST API with:
   1. server.js - basic Express server on port 3000
   2. routes.js - GET /api/status endpoint
   3. package.json - with express dependency
   4. README.md - with setup instructions"
```

**Verify:**
```bash
ls server.js routes.js package.json README.md
cat README.md
```

**What this proves:**
- ✅ Complex multi-file projects work
- ✅ Autonomous development capability
- ✅ Understands project structure
- ✅ Creates coherent documentation

---

## 🎯 Minimum Viable Test

If you only have 30 seconds, run this:

```bash
copilot-auto --max-iterations 5 "Create test.txt with 'Success!' and list all txt files"
```

Then verify:
```bash
cat test.txt && ls *.txt
```

If this works without any approval prompts and creates the file correctly, **your auto-approval wrapper is working!** ✅

---

## 📊 Test Checklist

Mark each as you complete:

- [ ] Run `npm test` - All automated tests pass
- [ ] Manual basic test - File created without prompts
- [ ] Code generation test - Working code produced
- [ ] Safety limit test - Process stops at limit
- [ ] Real-world test - Multi-file project works
- [ ] Interactive mode - Run `copilot-auto` and test a few prompts

---

## 🧹 Cleanup After Testing

```bash
# Remove all test files
rm test*.* calculator.js server.js routes.js hello.txt

# Or if you want to be thorough
rm *.txt *.js *.json README.md  # Be careful in real projects!

# Safe cleanup if in git repo
git clean -fd --dry-run  # Shows what would be deleted
git clean -fd            # Actually deletes untracked files
```

---

## 💡 Advanced Test Ideas

Once basics work, try these:

### Test Iteration Continuity
```bash
copilot-auto --max-iterations 30 \
  "Analyze all JS files, create a summary report, then refactor any code that needs improvement"
```

### Test Error Handling
```bash
copilot-auto --max-iterations 5 \
  "Read nonexistent.txt and create a summary"
```
Should handle gracefully without crashing.

### Test Interactive Mode
```bash
copilot-auto --max-iterations 50
# Then give it multiple commands in sequence
```

---

## ✅ Success Criteria

Your wrapper is working correctly if:

1. ✅ **No approval prompts appear** during execution
2. ✅ **Files are created** as requested
3. ✅ **Limits are enforced** (stops at max iterations)
4. ✅ **Process exits cleanly** (no hanging)
5. ✅ **Error handling works** (doesn't crash on errors)
6. ✅ **Code generation works** (produces valid code)
7. ✅ **Multi-step tasks work** (handles complex requests)

---

## 🚀 Quick Validation (Copy & Paste)

```bash
# Run all three tests in sequence
echo "Test 1: Basic..."
copilot-auto --max-iterations 5 "Create t1.txt with 'Test 1 OK'"
cat t1.txt

echo -e "\nTest 2: Multi-step..."
copilot-auto --max-iterations 10 "Create t2a.txt, t2b.txt, t2c.txt with A, B, C"
cat t2a.txt t2b.txt t2c.txt

echo -e "\nTest 3: Code..."
copilot-auto --max-iterations 10 "Create t3.js with a simple hello function"
cat t3.js

echo -e "\n✅ All manual tests complete!"
rm t*.txt t*.js
```

---

## 📈 Recommended Order

**First Time User:**
1. Run `npm test` (automated)
2. Try the minimum viable test
3. Try one real-world test

**Before Production Use:**
1. Run full test suite
2. Test with your actual workflow
3. Test safety limits thoroughly
4. Configure denied tools appropriately

**Regular Validation:**
1. Quick: `npm test`
2. Periodic: Real-world workflow test
3. After updates: Full test suite

---

## 🎉 You're Ready!

Once these tests pass, your auto-approval wrapper is fully functional and ready for autonomous development tasks!

Remember:
- Start with low iteration counts (10-20)
- Always work in version control
- Use `--deny-tool` for dangerous operations
- Review changes after completion
- Monitor logs at `~/.copilot/logs/`
