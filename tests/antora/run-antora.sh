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

# Ensure we capture all output
if [ "$CI" = "true" ]; then
  # CI run with explicit logging
  ANTORA_LOG_LEVEL=all ANTORA_LOG_FORMAT=json npx antora --stacktrace "$1" 2>&1
else
  # Regular local run
  ANTORA_LOG_LEVEL=info npx antora --stacktrace "$1" 2>&1
fi

echo "=== Antora Run Complete ==="
