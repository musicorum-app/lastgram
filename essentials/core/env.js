import { findUpSync } from 'find-up'
import dotenv from 'dotenv'

// loading env
const path = findUpSync(process.env.ENV_FILE || '.env')
dotenv.config({ path })
