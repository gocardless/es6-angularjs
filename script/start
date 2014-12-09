#!/bin/bash
# Usage: script/start
# Starts the projects's development server.

set -e errexit

./script/precompile
./script/css

node ./script/lib/watch.js --root ./client &

node ./script/lib/server.js --port=3010 --open=true --verbose --root ./client
