#!/bin/bash

INSTALL_DIR="$PREFIX/bin/x"

# 檢查是否存在目錄，如果不存在就創建它
if [ ! -d "$PREFIX/bin" ]; then
    echo -e "\e[1;34m[INFO]\e[0m Directory $PREFIX/bin does not exist. Creating it now..."
    mkdir -p "$PREFIX/bin"
fi

# 確保 xinstall.sh 可執行
chmod +x x-install.sh

# 移動到正確的安裝位置
mv x-install.sh "$INSTALL_DIR"

# 確認安裝完成
echo -e "\e[1;32m[✔] x-install.sh has been moved to $INSTALL_DIR.\e[0m"

# 下載文件確認
echo -e "\e[1;34m[INFO]\e[0m Do you want to send a notification email? (Y/N)"
read -r user_response

if [[ "$user_response" == "Y" || "$user_response" == "y" ]]; then
    # 如果用戶選擇發送郵件，詢問郵件地址
    echo -e "\e[1;34m[INFO]\e[0m Please enter your email address:"
    read -r user_email
    
    # 檢查是否已經安裝郵件工具
    if ! command -v msmtp &>/dev/null; then
        echo -e "\e[1;31m[ERROR]\e[0m msmtp is not installed. Please install it first."
        echo -e "You can install msmtp with: \`pkg install msmtp\`"
        exit 1
    fi

    # 設置郵件主題和內容
    subject="Termux x Download the file"
    body="The file has been downloaded successfully on Termux."

    # 發送郵件
    echo "$body" | msmtp --subject="$subject" "$user_email"
    echo -e "\e[1;32m[✔] Email sent to $user_email.\e[0m"
else
    echo -e "\e[1;33m[INFO]\e[0m Email notification skipped."
fi