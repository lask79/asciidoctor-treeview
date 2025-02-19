#!/bin/bash
set -x  # Print commands as they are executed

# Print environment info
echo "=== Environment Info ==="
echo "PWD: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "=== Antora Version ==="
npx antora --version

echo "=== Setting Environment Variables ==="
export ANTORA_LOG_LEVEL=info
export DEBUG=antora:*

echo "=== Checking Playbook ==="
echo "Playbook path: $1"
ls -l "$1"

echo "=== Running Antora ==="
npx antora --stacktrace --log-level=info "$1"

echo "=== Antora Run Complete ==="
