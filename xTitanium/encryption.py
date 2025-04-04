import sys
import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

# 从主密码派生加密密钥
def derive_key(password):
    salt = b"saltsalt"  # 你可以更改这个为随机生成的盐值
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    return kdf.derive(password.encode())

# 加密数据
def encrypt_data(password, file_path):
    key = derive_key(password)
    with open(file_path, 'rb') as f:
        data = f.read()

    iv = os.urandom(16)  # 随机生成初始化向量（IV）
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(data) + encryptor.finalize()

    with open(file_path + ".enc", 'wb') as enc_file:
        enc_file.write(iv + ciphertext)  # 存储 IV 和加密后的数据

# 解密数据
def decrypt_data(password, file_path):
    key = derive_key(password)
    with open(file_path, 'rb') as enc_file:
        enc_data = enc_file.read()

    iv = enc_data[:16]  # 提取 IV
    ciphertext = enc_data[16:]

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    plaintext = decryptor.update(ciphertext) + decryptor.finalize()

    return plaintext

# 验证主密码
def verify_master_password():
    password = input("Please enter your master password: ")
    try:
        with open("passwords.enc", "rb") as file:
            decrypt_data(password, "passwords.enc")
        print("Master password verified successfully!")
        return True
    except Exception:
        print("Incorrect master password!")
        return False

# 根据命令执行不同的操作
if __name__ == "__main__":
    if sys.argv[1] == "encrypt":
        encrypt_data(sys.argv[2], sys.argv[3])
    elif sys.argv[1] == "decrypt":
        decrypt_data(sys.argv[2], sys.argv[3])
    elif sys.argv[1] == "verify_master_password":
        verify_master_password()