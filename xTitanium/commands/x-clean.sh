#!/bin/bash

DOWNLOAD_DIR="downloads"

if [[ -d "$DOWNLOAD_DIR" ]]; then
    rm -rf "$DOWNLOAD_DIR"
    echo -e "\e[1;32m[✔] Downloads cleared.\e[0m"
else
    echo -e "\e[1;33m[INFO]\e[0m No downloads to clear."
fi