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

# In CI, we need to ensure output is not buffered
if [ "$CI" = "true" ]; then
  # Run with unbuffered output and explicit logging
  PYTHONUNBUFFERED=1 npx antora --stacktrace \
    --log-level=all \
    --log-format=json \
    --fetch \
    --to-dir=public \
    --urls-preserve-trailing-slash \
    "$1" 2>&1
else
  # Regular local run
  npx antora --stacktrace --log-level=info "$1"
fi

echo "=== Antora Run Complete ==="
