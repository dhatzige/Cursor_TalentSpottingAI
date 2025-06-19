#!/usr/bin/env node

/**
 * This script checks for direct usage of useSearchParams from next/navigation
 * and warns about files that should be using useSafeSearchParams instead.
 * 
 * Run with: node scripts/check-search-params-usage.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

// Files to ignore (types, test files, etc.)
const ignoreFiles = [
  'types/react.d.ts',
  'useSafeSearchParams.ts',
  'test',
  'node_modules',
  '.next'
];

// Function to check if a file should be ignored
function shouldIgnoreFile(filePath) {
  return ignoreFiles.some(ignorePattern => filePath.includes(ignorePattern));
}

// Function to check for direct useSearchParams usage
async function checkFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Check for direct import of useSearchParams
    const hasDirectImport = content.includes("import { useSearchParams }") || 
                           content.includes("import {useSearchParams}");
    
    // Check for renamed import of useSearchParams that isn't useSafeSearchParams
    const hasRenamedImport = content.match(/import\s+{\s*.*useSearchParams\s+as\s+(?!useNextSearchParams).*}\s+from/);
    
    if (hasDirectImport || hasRenamedImport) {
      return {
        filePath,
        hasIssue: true,
        message: `Direct usage of useSearchParams found in ${filePath}`
      };
    }
    
    return {
      filePath,
      hasIssue: false
    };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return {
      filePath,
      hasIssue: false
    };
  }
}

// Function to recursively find all .ts and .tsx files
async function findFiles(directory) {
  const files = [];
  
  // Read all files in the directory
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (shouldIgnoreFile(fullPath)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      // Recursively search subdirectories
      const nestedFiles = await findFiles(fullPath);
      files.push(...nestedFiles);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main function
async function main() {
  try {
    const srcDirectory = path.join(process.cwd(), 'src');
    const files = await findFiles(srcDirectory);
    
    console.log(`Checking ${files.length} files for direct useSearchParams usage...`);
    
    const results = await Promise.all(files.map(checkFile));
    const issues = results.filter(result => result.hasIssue);
    
    if (issues.length > 0) {
      console.log('\n⚠️ Found direct useSearchParams usage in the following files:');
      issues.forEach(issue => {
        console.log(`- ${issue.filePath}`);
      });
      console.log('\nRecommendation: Replace with useSafeSearchParams from @/lib/hooks/useSafeSearchParams');
      process.exit(1);
    } else {
      console.log('\n✅ No direct useSearchParams usage found. Good job!');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
