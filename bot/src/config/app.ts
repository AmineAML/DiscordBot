import dotenv from 'dotenv'

dotenv.config()

export const {
    NODE_ENV,
    PORT
} = process.env

export const IN_PROD = NODE_ENV === 'production'