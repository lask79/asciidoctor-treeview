#!/bin/bash
set -x  # Print commands as they are executed

# Print environment info
echo "PWD: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Try Antora version
npx antora --version

# Run Antora with full output
ANTORA_LOG_LEVEL=info DEBUG=antora:* npx antora --stacktrace --log-level=info "$@"
