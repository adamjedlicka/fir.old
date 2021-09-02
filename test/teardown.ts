import path from 'path'
import fs from 'fs/promises'

export default async () => {
  await fs.rm(path.join(process.cwd(), '.test'), { recursive: true, force: true })
}
