export const aesDecrypt = async (
  ciphertext: string,
  iv: string,
  key: string,
) => {
  const rawKey = Uint8Array.from(atob(key), (c) => c.charCodeAt(0))
  const rawIV = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0))

  const ciphertextBuffer = Uint8Array.from(atob(ciphertext), (c) =>
    c.charCodeAt(0),
  )

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

  const cleartextBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: rawIV,
    },
    secretKey,
    ciphertextBuffer,
  )

  return new TextDecoder().decode(cleartextBuffer)
}
