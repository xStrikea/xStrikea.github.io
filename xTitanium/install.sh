#!/bin/bash

REPO_URL="https://github.com/xStrikea/xSpecter.git"
INSTALL_DIR="$PREFIX/bin/x-commands"

echo -e "\e[1;34m[INFO]\e[0m Installing x command system..."
rm -rf "$INSTALL_DIR"
git clone --depth=1 "$REPO_URL" "$INSTALL_DIR"

# 安裝主 x 命令
chmod +x "$INSTALL_DIR/x.sh"
mv "$INSTALL_DIR/x.sh" "$PREFIX/bin/x"

echo -e "\e[1;32m[✔] Installation complete! Use 'x' to get started.\e[0m"