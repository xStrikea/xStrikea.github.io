import sys
import requests
from tqdm import tqdm

def download_file(url, filename):
    try:
        response = requests.get(url, stream=True)
        total_size = int(response.headers.get('content-length', 0))
        block_size = 1024
        progress_bar = tqdm(total=total_size, unit='B', unit_scale=True)

        with open(filename, 'wb') as file:
            for data in response.iter_content(block_size):
                progress_bar.update(len(data))
                file.write(data)
        progress_bar.close()

        if total_size != 0 and progress_bar.n != total_size:
            print("Download failed")
            sys.exit(1)
        print(f"Download completed: {filename}")

    except Exception as e:
        print(f"Error downloading file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: downloader.py <URL> <filename>")
        sys.exit(1)
    
    url = sys.argv[1]
    filename = sys.argv[2]
    download_file(url, filename)