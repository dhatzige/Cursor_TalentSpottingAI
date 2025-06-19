#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Function to add the dynamic directive to a file if it doesn't have it already
async function addDynamicDirectiveToFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Check if the file already has the dynamic directive
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      console.log(`✓ ${filePath} already has dynamic directive`);
      return false;
    }
    
    // Add the dynamic directive after 'use client' directive
    const newContent = content.replace(
      "'use client';", 
      "'use client';\n\nexport const dynamic = 'force-dynamic';"
    );
    
    await writeFile(filePath, newContent);
    console.log(`✓ Added dynamic directive to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Function to recursively find all page.tsx files
async function findPageFiles(directory) {
  const pageFiles = [];
  
  // Read all files in the directory
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // Recursively search subdirectories
      const nestedPageFiles = await findPageFiles(filePath);
      pageFiles.push(...nestedPageFiles);
    } else if (file === 'page.tsx') {
      // Check if the file contains 'use client'
      const content = await readFile(filePath, 'utf8');
      if (content.includes("'use client'")) {
        pageFiles.push(filePath);
      }
    }
  }
  
  return pageFiles;
}

// Main function
async function main() {
  try {
    const appDirectory = path.join(process.cwd(), 'src', 'app');
    const pageFiles = await findPageFiles(appDirectory);
    
    console.log(`Found ${pageFiles.length} client-side page files`);
    
    let modifiedCount = 0;
    for (const filePath of pageFiles) {
      const modified = await addDynamicDirectiveToFile(filePath);
      if (modified) {
        modifiedCount++;
      }
    }
    
    console.log(`\nSummary: Added dynamic directive to ${modifiedCount} files`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
