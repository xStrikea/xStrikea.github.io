#!/bin/bash

# 设定 GitHub 仓库 URL 和命令目录
REPO_URL="https://github.com/xStrikea/xSpecter.git"
COMMANDS_DIR="$PREFIX/bin/x-commands"

# 确保命令目录存在
mkdir -p "$COMMANDS_DIR"

# 自动下载 GitHub 命令
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

# 执行指定命令
if [[ -z "$1" ]]; then
    # 如果没有输入命令，列出所有命令
    list_commands
elif [[ "$1" == "upgrade" ]]; then
    # 如果输入命令是 "upgrade"，则更新命令
    update_commands
else
    # 执行指定命令
    cmd="$COMMANDS_DIR/x-$1.sh"
    shift
    if [[ -x "$cmd" ]]; then
        "$cmd" "$@"
    else
        echo -e "\e[1;31m[ERROR]\e[0m Command 'x $1' not found!"
        list_commands
    fi
fi