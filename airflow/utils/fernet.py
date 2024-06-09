from cryptography.fernet import Fernet

# Generate a new Fernet key
fernet_key = Fernet.generate_key()
print(fernet_key.decode())
