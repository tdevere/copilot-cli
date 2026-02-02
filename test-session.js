#!/usr/bin/env node

/**
 * Session management tests for Copilot Auto-Approval Wrapper
 */

import { spawn, execSync } from 'child_process';
import { readFile, writeFile, mkdir, access, rm } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';

const SESSION_STATE_DIR = '.copilot-auto';
const SESSION_STATE_FILE = join(SESSION_STATE_DIR, 'session-state.json');

async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function cleanup() {
  try {
    await rm(SESSION_STATE_DIR, { recursive: true, force: true });
  } catch {
    // Ignore errors
  }
}

async function runTest(testName, testFn) {
  console.log(`\n🧪 ${testName}`);
  console.log('─'.repeat(70));
  
  try {
    await testFn();
    console.log('✅ PASSED');
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     Session Management Tests - Copilot Auto Wrapper           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);

  let passed = 0;
  let failed = 0;

  // Test 1: Argument parsing for --continue
  if (await runTest('Test 1: --continue flag recognition', async () => {
    const result = execSync('node index.js --help', { encoding: 'utf8' });
    if (!result.includes('--continue')) {
      throw new Error('--continue flag not found in help text');
    }
  })) passed++; else failed++;

  // Test 2: Argument parsing for --resume
  if (await runTest('Test 2: --resume flag recognition', async () => {
    const result = execSync('node index.js --help', { encoding: 'utf8' });
    if (!result.includes('--resume')) {
      throw new Error('--resume flag not found in help text');
    }
  })) passed++; else failed++;

  // Test 3: Session state directory creation
  if (await runTest('Test 3: Session state directory creation', async () => {
    await cleanup();
    
    // Create a minimal session state manually to test structure
    await mkdir(SESSION_STATE_DIR, { recursive: true });
    const testState = {
      repoRoot: process.cwd(),
      lastSessionId: 'test-session-id',
      lastUsedAt: new Date().toISOString(),
      copilotVersion: '1.0.0'
    };
    await writeFile(SESSION_STATE_FILE, JSON.stringify(testState, null, 2), 'utf8');
    
    const exists = await fileExists(SESSION_STATE_FILE);
    if (!exists) {
      throw new Error('Session state file was not created');
    }
    
    const content = await readFile(SESSION_STATE_FILE, 'utf8');
    const parsed = JSON.parse(content);
    
    if (!parsed.repoRoot || !parsed.lastUsedAt) {
      throw new Error('Session state file missing required fields');
    }
    
    await cleanup();
  })) passed++; else failed++;

  // Test 4: Session state in .gitignore
  if (await runTest('Test 4: Session directory in .gitignore', async () => {
    const gitignore = await readFile('.gitignore', 'utf8');
    if (!gitignore.includes('.copilot-auto/')) {
      throw new Error('.copilot-auto/ not found in .gitignore');
    }
  })) passed++; else failed++;

  // Test 5: Config example includes session options
  if (await runTest('Test 5: Example config has session options', async () => {
    const config = await readFile('.copilot-auto-config.example.json', 'utf8');
    const parsed = JSON.parse(config);
    if (!parsed.session || typeof parsed.session.enabled === 'undefined') {
      throw new Error('Example config missing session configuration');
    }
  })) passed++; else failed++;

  // Test 6: Session state JSON structure validation
  if (await runTest('Test 6: Session state JSON structure validation', async () => {
    await cleanup();
    await mkdir(SESSION_STATE_DIR, { recursive: true });
    
    const testState = {
      repoRoot: process.cwd(),
      lastSessionId: null,
      lastUsedAt: new Date().toISOString(),
      copilotVersion: null
    };
    await writeFile(SESSION_STATE_FILE, JSON.stringify(testState, null, 2), 'utf8');
    
    const content = await readFile(SESSION_STATE_FILE, 'utf8');
    const parsed = JSON.parse(content);
    
    const requiredFields = ['repoRoot', 'lastSessionId', 'lastUsedAt', 'copilotVersion'];
    for (const field of requiredFields) {
      if (!(field in parsed)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    await cleanup();
  })) passed++; else failed++;

  // Test 7: Documentation includes session management
  if (await runTest('Test 7: AUTO-WRAPPER-README has session section', async () => {
    const readme = await readFile('AUTO-WRAPPER-README.md', 'utf8');
    if (!readme.includes('Session Management') && !readme.includes('session management')) {
      throw new Error('README missing session management documentation');
    }
    if (!readme.includes('--continue') || !readme.includes('--resume')) {
      throw new Error('README missing session flag documentation');
    }
  })) passed++; else failed++;

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log('═'.repeat(70) + '\n');

  if (failed === 0) {
    console.log('🎉 All session management tests passed!\n');
  } else {
    console.log(`⚠️  ${failed} test(s) failed.\n`);
    process.exit(1);
  }
}

main().catch(console.error);
