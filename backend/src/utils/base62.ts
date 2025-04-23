const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = ALPHABET.length; // 62

/**
 * Encodes a positive integer into a base-62 string.
 * @param num The positive integer to encode.
 * @returns The base-62 encoded string.
 */
export function encodeToBase62(num: number): string {
  if (num === 0) {
    return ALPHABET[0];
  }

  let encoded = '';
  while (num > 0) {
    const remainder = num % BASE;
    encoded = ALPHABET[remainder] + encoded; // Prepend the character
    num = Math.floor(num / BASE);
  }

  return encoded;
}

// Optional: You might want a decode function later for debugging or other purposes
// export function decodeFromBase62(str: string): number {
//   let decoded = 0;
//   for (let i = 0; i < str.length; i++) {
//     const char = str[i];
//     const index = ALPHABET.indexOf(char);
//     if (index === -1) {
//       throw new Error('Invalid base-62 character');
//     }
//     decoded = decoded * BASE + index;
//   }
//   return decoded;
// } 