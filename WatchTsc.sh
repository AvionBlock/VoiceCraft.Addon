#!/bin/bash

# Typescript
tsc --watch ./Basic/tsconfig.json --preserveWatchOutput &
tsc --watch ./Core.McHttp/tsconfig.json --preserveWatchOutput &
tsc --watch ./Core.McWss/tsconfig.json --preserveWatchOutput
wait