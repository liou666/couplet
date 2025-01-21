import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const CURRENT_DIR_PATH = dirname(fileURLToPath(import.meta.url))
