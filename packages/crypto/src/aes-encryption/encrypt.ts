export const aesEncrypt = async (plaintext: string, key: string) => {
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encodedPlaintext = new TextEncoder().encode(plaintext)

  const rawKey = Uint8Array.from(atob(key), (c) => c.charCodeAt(0))

  const secretKey = await crypto.subtle.importKey(
    'raw',
    rawKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  )

  const ciphertextBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    secretKey,
    encodedPlaintext,
  )

  const ciphertext = btoa(
    String.fromCharCode.apply(
      null,
      Array.from(new Uint8Array(ciphertextBuffer)),
    ),
  )

  const base64IV = btoa(String.fromCharCode.apply(null, Array.from(iv)))

  return {
    ciphertext,
    iv: base64IV,
  }
}
