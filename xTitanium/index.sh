#!/bin/bash

# Function: Check if required packages are installed
check_dependencies() {
    # Check and install Python 3
    if ! command -v python3 &>/dev/null; then
        echo -e "\e[1;33m[WARNING]\e[0m Python 3 not found. Installing now..."
        pkg install -y python
    fi

    # Check and install aria2 (fast multi-threaded download)
    if ! command -v aria2c &>/dev/null; then
        echo -e "\e[1;33m[WARNING]\e[0m aria2 not found. Installing now..."
        pkg install -y aria2
    fi

    # Check if tqdm (Python progress bar) is installed
    if ! python3 -c "import tqdm" &>/dev/null; then
        echo -e "\e[1;33m[WARNING]\e[0m Python module 'tqdm' not found. Installing now..."
        pip install tqdm
    fi
}

# Function: Download with progress bar using Python
download_file() {
    local url="$1"
    local filename="downloads/$(basename "$url")"

    echo -e "\e[1;34m[INFO]\e[0m Starting download: $filename"

    python3 - <<EOF
import sys
import requests
from tqdm import tqdm

url = "$url"
filename = "$filename"

response = requests.get(url, stream=True)
total_size = int(response.headers.get('content-length', 0))

with open(filename, 'wb') as file, tqdm(
    desc=filename,
    total=total_size,
    unit='B',
    unit_scale=True,
    unit_divisor=1024,
) as bar:
    for chunk in response.iter_content(chunk_size=1024):
        file.write(chunk)
        bar.update(len(chunk))

print("\033[1;32m[✔] Download complete: " + filename + "\033[0m")
EOF
}

# Function: Install a file after downloading
install_file() {
    local filename="$1"

    chmod +x "$filename"
    echo -e "\e[1;32m[✔] Installation started: $filename\e[0m"
    "$filename"
}

# Main function: x install <URL>
x_install() {
    local url="$1"

    echo -e "\e[1;36m[?]\e[0m Do you want to download this file? (Y/N)"
    read -r confirm
    case "$confirm" in
        [Yy]* ) download_file "$url"; install_file "downloads/$(basename "$url")" ;;
        [Nn]* ) echo -e "\e[1;31m[✘] Download cancelled.\e[0m" ;;
        * ) echo -e "\e[1;33m[!] Invalid input. Please enter Y or N.\e[0m" ;;
    esac
}

# Run checks before allowing installation
check_dependencies

# Command-line interface (CLI)
while true; do
    echo -e "\e[1;35m[✦]\e[0m Enter command (e.g., 'install <URL>') or type 'exit':"
    read -r command arg

    if [ "$command" == "install" ] && [ -n "$arg" ]; then
        x_install "$arg"
    elif [ "$command" == "exit" ]; then
        echo -e "\e[1;31m[✘] Exiting x installer.\e[0m"
        break
    else
        echo -e "\e[1;33m[!] Invalid command. Use 'install <URL>' or 'exit'.\e[0m"
    fi
done