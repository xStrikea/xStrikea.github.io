#!/bin/bash

COMMANDS_DIR="$PREFIX/bin/x-commands"

echo -e "\e[1;34m[INFO]\e[0m Available commands:"
for file in "$COMMANDS_DIR"/*.sh; do
    cmd=$(basename "$file" .sh)
    echo -e "\e[1;32m - ${cmd/x-/}\e[0m"
done