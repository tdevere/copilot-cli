#!/usr/bin/env node

/**
 * Automated test runner for Copilot Auto-Approval Wrapper
 * Runs a series of progressive tests to validate functionality
 */

import { spawn } from 'child_process';
import { readFile, access } from 'fs/promises';
import { constants } from 'fs';

const TEST_RESULTS = [];

async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function runTest(testName, command, verifyFn) {
  console.log(`\n🧪 Running: ${testName}`);
  console.log(`Command: ${command}`);
  console.log('─'.repeat(70));
  
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const proc = spawn(command, [], { shell: true, stdio: 'inherit' });
    
    proc.on('close', async (code) => {
      const duration = Date.now() - startTime;
      
      let result = {
        name: testName,
        duration,
        exitCode: code,
        success: false,
        message: ''
      };
      
      if (code === 0 && verifyFn) {
        try {
          const verification = await verifyFn();
          result.success = verification.success;
          result.message = verification.message;
        } catch (error) {
          result.success = false;
          result.message = `Verification failed: ${error.message}`;
        }
      } else if (code === 0) {
        result.success = true;
        result.message = 'Command completed successfully';
      } else {
        result.message = `Command failed with exit code ${code}`;
      }
      
      TEST_RESULTS.push(result);
      
      const status = result.success ? '✅ PASSED' : '❌ FAILED';
      console.log(`\n${status} - ${result.message} (${(duration/1000).toFixed(1)}s)\n`);
      
      resolve(result);
    });
  });
}

function printSummary() {
  console.log('\n' + '═'.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(70) + '\n');
  
  let passed = 0;
  let failed = 0;
  
  TEST_RESULTS.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    const duration = (result.duration / 1000).toFixed(1);
    console.log(`${status} Test ${index + 1}: ${result.name} (${duration}s)`);
    if (!result.success) {
      console.log(`   └─ ${result.message}`);
    }
    
    if (result.success) passed++;
    else failed++;
  });
  
  console.log('\n' + '─'.repeat(70));
  console.log(`Total: ${TEST_RESULTS.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('═'.repeat(70) + '\n');
  
  if (failed === 0) {
    console.log('🎉 All tests passed! The auto-approval wrapper is working correctly.\n');
  } else {
    console.log(`⚠️  ${failed} test(s) failed. Please review the output above.\n`);
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🧪  Copilot Auto-Approval Wrapper - Test Suite  🧪           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
  
  // Test 1: Basic File Creation
  await runTest(
    'Basic File Creation',
    'copilot-auto --max-iterations 5 "Create a file named test-basic.txt with the text \'Basic test passed\'"',
    async () => {
      const exists = await fileExists('test-basic.txt');
      if (!exists) return { success: false, message: 'File was not created' };
      
      const content = await readFile('test-basic.txt', 'utf8');
      if (content.includes('Basic test passed')) {
        return { success: true, message: 'File created with correct content' };
      }
      return { success: false, message: 'File content incorrect' };
    }
  );
  
  // Test 2: Multi-Step Operations
  await runTest(
    'Multi-Step File Creation',
    'copilot-auto --max-iterations 10 "Create test-a.txt with \'A\', test-b.txt with \'B\', test-c.txt with \'C\'"',
    async () => {
      const aExists = await fileExists('test-a.txt');
      const bExists = await fileExists('test-b.txt');
      const cExists = await fileExists('test-c.txt');
      
      if (aExists && bExists && cExists) {
        return { success: true, message: 'All 3 files created successfully' };
      }
      return { success: false, message: `Only ${[aExists, bExists, cExists].filter(x=>x).length}/3 files created` };
    }
  );
  
  // Test 3: Code Generation
  await runTest(
    'Code Generation',
    'copilot-auto --max-iterations 10 "Create test-math.js with a simple add function that takes two numbers and returns their sum"',
    async () => {
      const exists = await fileExists('test-math.js');
      if (!exists) return { success: false, message: 'JS file was not created' };
      
      const content = await readFile('test-math.js', 'utf8');
      if (content.includes('function') || content.includes('const') || content.includes('add')) {
        return { success: true, message: 'Code file created with function' };
      }
      return { success: false, message: 'Generated code seems incomplete' };
    }
  );
  
  // Print summary
  printSummary();
  
  // Cleanup instructions
  console.log('🧹 Cleanup:');
  console.log('   rm test-*.txt test-*.js\n');
}

main().catch(console.error);
