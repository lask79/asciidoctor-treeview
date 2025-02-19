#!/bin/bash

# Run Antora with stacktrace for better error reporting
npx antora --stacktrace "$1" 2>&1
