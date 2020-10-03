require('dotenv').config()

export const userCredentials = {
  publicKey: process.env.PUBLIC_KEY?.toLowerCase() || '',
  privateKey: Buffer.from(process.env.PRIVATE_KEY?.toLowerCase() || '', 'hex')
}
