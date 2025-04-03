#!/bin/bash

REPO_URL="https://github.com/xStrikea/xSpecter.git"
COMMANDS_DIR="$PREFIX/bin/x-commands"

# 確保命令目錄存在
mkdir -p "$COMMANDS_DIR"

# 自動下載 GitHub 命令
update_commands() {
    echo -e "\e[1;34m[INFO]\e[0m Updating x commands..."
    rm -rf "$COMMANDS_DIR"
    git clone --depth=1 "$REPO_URL" "$COMMANDS_DIR"
    chmod +x "$COMMANDS_DIR"/*.sh
    echo -e "\e[1;32m[✔] Update complete!\e[0m"
}

# 列出可用命令
list_commands() {
    echo -e "\e[1;34mAvailable commands:\e[0m"
    for file in "$COMMANDS_DIR"/*.sh; do
        cmd=$(basename "$file" .sh)
        echo -e "\e[1;32m - ${cmd/x-/}\e[0m"
    done
}

# 執行指定命令
if [[ -z "$1" ]]; then
    list_commands
elif [[ "$1" == "upgrade" ]]; then
    update_commands
else
    cmd="$COMMANDS_DIR/x-$1.sh"
    shift
    if [[ -x "$cmd" ]]; then
        "$cmd" "$@"
    else
        echo -e "\e[1;31m[ERROR]\e[0m Command 'x $1' not found!"
    fi
fi