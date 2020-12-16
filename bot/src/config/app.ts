import { NODE_ENV, PORT } from "./env"

export const IN_PROD = NODE_ENV === 'production'

export const port = PORT || 3000