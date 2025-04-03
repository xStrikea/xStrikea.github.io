#!/bin/bash

# 儲存 GitHub URL 和目標安裝目錄
REPO_URL="https://github.com/xStrikea/xSpecter.git"
INSTALL_DIR="$PREFIX/bin/x-commands"
TARGET_SCRIPT="$INSTALL_DIR/xTitanium.sh"

# 確保安裝目錄存在
if [ ! -d "$PREFIX/bin" ]; then
    mkdir -p "$PREFIX/bin"
fi

# 克隆或更新命令
echo -e "\e[1;34m[INFO]\e[0m Installing x command system..."
rm -rf "$INSTALL_DIR"
git clone --depth=1 "$REPO_URL" "$INSTALL_DIR"

# 確保腳本可執行
chmod +x "$INSTALL_DIR/xTitanium.sh"

# 將 xTitanium.sh 重新命名並移動到系統 bin 目錄
mv "$INSTALL_DIR/xTitanium.sh" "$PREFIX/bin/x"

echo -e "\e[1;32m[✔] Installation complete! Use 'x' to get started.\e[0m"