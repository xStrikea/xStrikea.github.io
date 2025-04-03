#!/bin/bash

GITHUB_REPO="https://github.com/xStrikea/xSpecter.git"
CLONE_DIR="$PREFIX/bin/x-commands"

echo -e "\e[1;34m[INFO]\e[0m Updating x command system..."
rm -rf "$CLONE_DIR"
git clone --depth=1 "$GITHUB_REPO" "$CLONE_DIR"
chmod +x "$CLONE_DIR"/*.sh
echo -e "\e[1;32m[✔] Update complete!\e[0m"