![logo](image/logo-readme.png)

# Overview

x is a custom shell command system that provides multiple utilities for downloading, installing, and managing files efficiently in Termux.

# Command List

1. x install <URL>

Description: Downloads a file from the specified URL and installs it. Usage:
```
x install https://example.com/file.sh
```
2. x upgrade

Description: Updates the xSpecter.github.io repository. Usage:
```
x upgrade
```
3. x list

Description: Displays a list of all available x commands. Usage:
```
x list
```
4. x clean

Description: Clears the downloads directory to free up space. Usage:
```
x clean
```
5. x info

Description: Shows system information, including storage, memory, and installed dependencies. Usage:
```
x info
```
6. x help

Description: Displays help information for all x commands. Usage:
```
x help
```

# Installation

To install x, follow these steps:
```
rm -rf xSpecter.github.io
git clone https://github.com/xStrikea/xSpecter.github.io.git
cd xSpecter.github.io
cd xTitanium
chmod +x xTitanium.sh
./xTitanium.sh
```
Now you can use x commands from anywhere in Termux.

# License
This repository is licensed under the MIT license. Please be careful not to change the content.


# Contribution

Feel free to suggest new commands or improvements by creating an issue on GitHub!

