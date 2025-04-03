#!/bin/bash

# Check if Python is installed, install if missing
check_python() {
    if ! command -v python3 &>/dev/null; then
        echo "Python 3 not detected, installing..."
        pkg install -y python
        if ! command -v python3 &>/dev/null; then
            echo "Python 3 installation failed, please install manually."
            exit 1
        fi
    fi
}

# Check if aria2c is installed, install if missing (alternative download method)
check_aria2() {
    if ! command -v aria2c &>/dev/null; then
        echo "aria2c not detected, installing..."
        pkg install -y aria2
        if ! command -v aria2c &>/dev/null; then
            echo "aria2c installation failed, please install manually."
            exit 1
        fi
    fi
}

# Function to download and install
x_install() {
    local url="$1"
    local filename="downloads/$(basename "$url")"

    echo "Starting download: $filename"
    download_file "$url" "$filename"
    
    echo "Download completed: $filename"
    chmod +x "$filename"  # Give execution permission
    echo "Executing installation: $filename"
    "$filename"  # Execute the downloaded file
}

# Download function using aria2c (faster multi-threaded download)
download_file() {
    local url="$1"
    local filename="$2"

    # Use aria2c for multi-threaded download
    aria2c -x 16 -s 16 -o "$filename" "$url" --continue=true --show-console-readout=false
    if [ $? -ne 0 ]; then
        echo "Download failed"
        exit 1
    fi
}

# Automatically run main function
check_python  # Check Python installation
check_aria2   # Check aria2c installation

# Infinite loop for waiting commands
while true; do
    echo "Enter a command (e.g., 'install <url>') or type 'exit' to quit:"
    read command arg

    if [ "$command" == "install" ] && [ -n "$arg" ]; then
        x_install "$arg"
    elif [ "$command" == "exit" ]; then
        echo "Exiting the program."
        break  # Exit the loop and terminate the script
    else
        echo "Invalid command. Please enter 'install <url>' or 'exit'."
    fi
done