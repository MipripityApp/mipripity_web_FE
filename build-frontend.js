#!/usr/bin/env node

/**
 * Custom build script for Netlify deployment
 * Provides better error handling and logging
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Main build function
async function buildFrontend() {
  try {
    log('Starting frontend build process...');
    
    // Ensure we're in the correct directory
    const rootDir = process.cwd();
    log(`Current directory: ${rootDir}`);
    
    // Check that webpack is installed
    log('Checking for webpack installation...');
    try {
      const webpackVersion = execSync('npx webpack --version', { encoding: 'utf8' });
      log(`Found webpack version: ${webpackVersion.trim()}`);
    } catch (error) {
      log('Error finding webpack. Installing webpack-cli...');
      execSync('npm install --no-save webpack webpack-cli', { stdio: 'inherit' });
    }

    // Ensure public directory exists for _redirects
    const publicDir = path.join(rootDir, 'public');
    if (!fs.existsSync(publicDir)) {
      log('Creating public directory...');
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Ensure _redirects file exists
    const redirectsPath = path.join(publicDir, '_redirects');
    if (!fs.existsSync(redirectsPath)) {
      log('Creating _redirects file...');
      fs.writeFileSync(redirectsPath, '/* /index.html 200');
    }

    // Run webpack with production settings
    log('Running webpack build...');
    execSync('npx webpack --mode production --progress', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    log('Frontend build completed successfully!');
    return true;
  } catch (error) {
    log(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the build
buildFrontend();