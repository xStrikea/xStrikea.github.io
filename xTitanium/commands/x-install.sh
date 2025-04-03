#!/bin/bash

if [[ -z "$1" ]]; then
    echo -e "\e[1;31m[ERROR]\e[0m Usage: x install <URL>"
    exit 1
fi

URL="$1"
FILENAME="downloads/$(basename "$URL")"

echo -e "\e[1;34m[INFO]\e[0m Downloading: $FILENAME"

python3 - <<EOF
import requests
from tqdm import tqdm

url = "$URL"
filename = "$FILENAME"

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

chmod +x "$FILENAME"
"$FILENAME"