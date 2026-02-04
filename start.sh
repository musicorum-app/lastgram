#!/bin/bash
bun run database:migrate
bun run src/index.ts