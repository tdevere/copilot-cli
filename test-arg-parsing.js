#!/usr/bin/env node

/**
 * Unit tests for argument parsing and configuration
 * Tests the new --enable-local-tool-synthesis and --no-mcp flags
 */

import { spawn } from 'child_process';

const TEST_RESULTS = [];

async function runTest(testName, testFn) {
  console.log(`\n🧪 ${testName}`);
  console.log('─'.repeat(50));
  
  const startTime = Date.now();
  
  try {
    const result = await testFn();
    const duration = Date.now() - startTime;
    
    TEST_RESULTS.push({
      name: testName,
      duration,
      success: result.success,
      message: result.message
    });
    
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} - ${result.message}`);
  } catch (error) {
    const duration = Date.now() - startTime;
    TEST_RESULTS.push({
      name: testName,
      duration,
      success: false,
      message: `Error: ${error.message}`
    });
    console.log(`❌ FAILED - ${error.message}`);
  }
}

function printSummary() {
  console.log('\n' + '═'.repeat(50));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(50));
  
  const passed = TEST_RESULTS.filter(r => r.success).length;
  const failed = TEST_RESULTS.filter(r => !r.success).length;
  
  console.log(`Total: ${TEST_RESULTS.length} | ✅ ${passed} | ❌ ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log(`\n⚠️  ${failed} test(s) failed`);
  }
}

// Test: --help shows new flags
async function testHelpShowsFlags() {
  return new Promise((resolve) => {
    const proc = spawn('node', ['index.js', '--help']);
    let output = '';
    
    proc.stdout.on('data', (data) => { output += data.toString(); });
    
    proc.on('close', () => {
      const hasToolSynthesis = output.includes('--enable-local-tool-synthesis');
      const hasNoMcp = output.includes('--no-mcp');
      const hasEnvVars = output.includes('Environment Variables');
      
      if (hasToolSynthesis && hasNoMcp && hasEnvVars) {
        resolve({ success: true, message: 'All new flags documented' });
      } else {
        resolve({ success: false, message: 'Missing flag documentation' });
      }
    });
  });
}

// Test: Default values are false
async function testDefaultValues() {
  // This test verifies the code structure contains correct defaults
  // by checking help text indicates "default: false"
  return new Promise((resolve) => {
    const proc = spawn('node', ['index.js', '--help']);
    let output = '';
    
    proc.stdout.on('data', (data) => { output += data.toString(); });
    
    proc.on('close', () => {
      const synthesisDefault = output.includes('synthesis (default: false)');
      const mcpDefault = output.includes('usage (default: false)');
      
      if (synthesisDefault && mcpDefault) {
        resolve({ success: true, message: 'Defaults documented as false' });
      } else {
        resolve({ success: false, message: 'Default values not clearly documented' });
      }
    });
  });
}

// Test: Environment variables documented
async function testEnvVarsDocumented() {
  return new Promise((resolve) => {
    const proc = spawn('node', ['index.js', '--help']);
    let output = '';
    
    proc.stdout.on('data', (data) => { output += data.toString(); });
    
    proc.on('close', () => {
      const hasToolSynthesisEnv = output.includes('COPILOT_LOCAL_TOOL_SYNTHESIS');
      const hasNoMcpEnv = output.includes('COPILOT_NO_MCP');
      
      if (hasToolSynthesisEnv && hasNoMcpEnv) {
        resolve({ success: true, message: 'Environment variables documented' });
      } else {
        resolve({ success: false, message: 'Environment variables missing' });
      }
    });
  });
}

// Test: Example usage includes new flags
async function testExampleUsage() {
  return new Promise((resolve) => {
    const proc = spawn('node', ['index.js', '--help']);
    let output = '';
    
    proc.stdout.on('data', (data) => { output += data.toString(); });
    
    proc.on('close', () => {
      const hasExample = output.includes('--enable-local-tool-synthesis --no-mcp');
      
      if (hasExample) {
        resolve({ success: true, message: 'Example usage includes new flags' });
      } else {
        resolve({ success: false, message: 'Example usage missing new flags' });
      }
    });
  });
}

// Test: Version command still works
async function testVersionCommand() {
  return new Promise((resolve) => {
    const proc = spawn('node', ['index.js', '--version']);
    let output = '';
    
    proc.stdout.on('data', (data) => { output += data.toString(); });
    
    proc.on('close', (code) => {
      if (code === 0 && output.trim()) {
        resolve({ success: true, message: 'Version command works' });
      } else {
        resolve({ success: false, message: 'Version command failed' });
      }
    });
  });
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════╗
║   Argument Parsing & Configuration Tests         ║
╚══════════════════════════════════════════════════╝
  `);

  await runTest('Test 1: Help shows new flags', testHelpShowsFlags);
  await runTest('Test 2: Default values are false', testDefaultValues);
  await runTest('Test 3: Environment variables documented', testEnvVarsDocumented);
  await runTest('Test 4: Example usage includes flags', testExampleUsage);
  await runTest('Test 5: Version command works', testVersionCommand);
  
  printSummary();
  console.log('');
}

main().catch(console.error);
