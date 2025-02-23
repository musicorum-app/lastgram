#!/bin/bash
bun run database:migrate --skip-generate
bun run src/index.ts