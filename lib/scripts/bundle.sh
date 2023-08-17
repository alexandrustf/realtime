#!/bin/bash

# Transpile TypeScript to JavaScript
npx tsc

# Copy only necessary node_modules to dist
mkdir -p dist/node_modules
cp -R node_modules/@aws-sdk dist/node_modules/