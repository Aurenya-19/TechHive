#!/usr/bin/env node

/**
 * CodeVerse Deployment Diagnostic Tool
 * Run this to identify deployment issues
 * 
 * Usage: node diagnose.js
 */

console.log('🔍 CodeVerse Deployment Diagnostics\n');
console.log('=====================================\n');

const issues = [];
const warnings = [];
const success = [];

// Check Node version
console.log('📦 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  issues.push(`Node.js version ${nodeVersion} is too old. Need v18 or higher.`);
} else {
  success.push(`Node.js version ${nodeVersion} ✓`);
}

// Check environment variables
console.log('\n🔐 Checking environment variables...');
const requiredEnvVars = [
  'DATABASE_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'SESSION_SECRET'
];

const optionalEnvVars = [
  'GOOGLE_CALLBACK_URL',
  'NODE_ENV',
  'PORT'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    issues.push(`Missing required environment variable: ${varName}`);
  } else if (process.env[varName].trim() === '') {
    issues.push(`Environment variable ${varName} is empty`);
  } else {
    // Check specific formats
    if (varName === 'DATABASE_URL') {
      if (!process.env[varName].startsWith('postgresql://')) {
        issues.push(`DATABASE_URL should start with postgresql://`);
      } else {
        success.push(`DATABASE_URL format looks correct ✓`);
      }
    } else if (varName === 'SESSION_SECRET') {
      if (process.env[varName].length < 32) {
        issues.push(`SESSION_SECRET should be at least 32 characters (current: ${process.env[varName].length})`);
      } else {
        success.push(`SESSION_SECRET length is sufficient ✓`);
      }
    } else if (varName === 'GOOGLE_CLIENT_ID') {
      if (!process.env[varName].includes('.apps.googleusercontent.com')) {
        warnings.push(`GOOGLE_CLIENT_ID format looks unusual`);
      } else {
        success.push(`GOOGLE_CLIENT_ID format looks correct ✓`);
      }
    } else {
      success.push(`${varName} is set ✓`);
    }
  }
});

optionalEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    warnings.push(`Optional environment variable not set: ${varName}`);
  } else {
    success.push(`${varName} is set ✓`);
  }
});

// Check package.json
console.log('\n📋 Checking package.json...');
try {
  const fs = require('fs');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.scripts.build) {
    issues.push('Missing "build" script in package.json');
  } else {
    success.push('Build script found ✓');
  }
  
  if (!packageJson.scripts.start) {
    issues.push('Missing "start" script in package.json');
  } else {
    success.push('Start script found ✓');
  }
  
  // Check critical dependencies
  const criticalDeps = ['express', 'drizzle-orm', '@neondatabase/serverless'];
  criticalDeps.forEach(dep => {
    if (!packageJson.dependencies[dep]) {
      issues.push(`Missing critical dependency: ${dep}`);
    } else {
      success.push(`${dep} dependency found ✓`);
    }
  });
} catch (err) {
  issues.push(`Cannot read package.json: ${err.message}`);
}

// Check TypeScript configuration
console.log('\n⚙️  Checking TypeScript configuration...');
try {
  const fs = require('fs');
  if (fs.existsSync('tsconfig.json')) {
    success.push('tsconfig.json found ✓');
  } else {
    warnings.push('tsconfig.json not found');
  }
} catch (err) {
  warnings.push(`Cannot check tsconfig.json: ${err.message}`);
}

// Check server files
console.log('\n📁 Checking server files...');
const serverFiles = [
  'server/index.ts',
  'server/routes.ts',
  'server/db.ts',
  'server/googleAuth.ts'
];

serverFiles.forEach(file => {
  try {
    const fs = require('fs');
    if (fs.existsSync(file)) {
      success.push(`${file} found ✓`);
    } else {
      issues.push(`Missing server file: ${file}`);
    }
  } catch (err) {
    issues.push(`Cannot check ${file}: ${err.message}`);
  }
});

// Test database connection (if DATABASE_URL is set)
console.log('\n🗄️  Testing database connection...');
if (process.env.DATABASE_URL) {
  (async () => {
    try {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(process.env.DATABASE_URL);
      await sql`SELECT 1`;
      success.push('Database connection successful ✓');
    } catch (err) {
      issues.push(`Database connection failed: ${err.message}`);
    }
    
    printResults();
  })();
} else {
  warnings.push('Skipping database test (DATABASE_URL not set)');
  printResults();
}

function printResults() {
  console.log('\n=====================================');
  console.log('📊 DIAGNOSTIC RESULTS\n');
  
  if (success.length > 0) {
    console.log('✅ SUCCESS (' + success.length + '):\n');
    success.forEach(msg => console.log('  ✓', msg));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (' + warnings.length + '):\n');
    warnings.forEach(msg => console.log('  ⚠', msg));
    console.log('');
  }
  
  if (issues.length > 0) {
    console.log('❌ ISSUES (' + issues.length + '):\n');
    issues.forEach(msg => console.log('  ✗', msg));
    console.log('');
  }
  
  console.log('=====================================\n');
  
  if (issues.length === 0) {
    console.log('🎉 All critical checks passed!');
    console.log('Your deployment should work.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Found ' + issues.length + ' issue(s) that need to be fixed.');
    console.log('Please address the issues above before deploying.\n');
    console.log('📖 See DEPLOYMENT_FIX.md for detailed solutions.\n');
    process.exit(1);
  }
}
