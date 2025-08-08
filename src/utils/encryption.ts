import CryptoJS from "crypto-js";

// Secret key for encryption - using environment variable
const SECRET_KEY =
  import.meta.env.VITE_PUBLIC_ENCRYPTION_KEY ||
  "fallback-secret-key-development-only";

/**
 * Encrypts data using AES encryption
 * @param data - The data to encrypt (string or object)
 * @returns Encrypted string
 */
export const encryptData = (data: any): string => {
  try {
    const jsonString = typeof data === "string" ? data : JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
};

/**
 * Decrypts data using AES decryption
 * @param encryptedData - The encrypted string to decrypt
 * @returns Decrypted data (parsed as JSON if possible)
 */
export const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error("Failed to decrypt data - invalid key or corrupted data");
    }

    // Try to parse as JSON, if it fails return as string
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
};

/**
 * Securely stores encrypted data in localStorage
 * @param key - The localStorage key
 * @param data - The data to encrypt and store
 */
export const setEncryptedStorage = (key: string, data: any): void => {
  try {
    const encryptedData = encryptData(data);
    localStorage.setItem(key, encryptedData);
  } catch (error) {
    console.error("Failed to store encrypted data:", error);
    throw error;
  }
};

/**
 * Retrieves and decrypts data from localStorage
 * @param key - The localStorage key
 * @returns Decrypted data or null if not found
 */
export const getEncryptedStorage = (key: string): any => {
  try {
    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) {
      return null;
    }
    return decryptData(encryptedData);
  } catch (error) {
    console.error("Failed to retrieve encrypted data:", error);
    // If decryption fails, remove the corrupted data
    localStorage.removeItem(key);
    return null;
  }
};

/**
 * Removes encrypted data from localStorage
 * @param key - The localStorage key
 */
export const removeEncryptedStorage = (key: string): void => {
  localStorage.removeItem(key);
};
