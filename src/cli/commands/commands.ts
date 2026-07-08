import fs from 'fs'
import path from 'path'
import { bold } from '@/logging/logging'
import { fileURLToPath } from 'url'

const red = (str: string) => `\x1b[31m${str}\x1b[0m`
const green = (str: string) => `\x1b[32m${str}\x1b[0m`

export const checkCommands = async () => {
    const commandsDir = 'src/commands/commands'
    const categories = fs.readdirSync(commandsDir)
    
    let missingDesc = 0
    let total = 0
    
    for (const category of categories) {
        if (category.startsWith('.')) continue
        const categoryPath = path.join(commandsDir, category)
        if (!fs.statSync(categoryPath).isDirectory()) continue
        
        const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.ts'))
        for (const file of files) {
            total++
            const filePath = path.join(categoryPath, file)
            // Import the command module
            const absolutePath = path.resolve(filePath)
            const module = await import(absolutePath)
            
            const info = module.info || {}
            
            let issues = []
            if (!info.description) {
                issues.push('description')
                missingDesc++
            }
            
            if (issues.length > 0) {
                console.log(red(`[${category}/${file}] missing exports: ${issues.join(', ')}`))
            }
        }
    }
    
    console.log(green(`\nChecked ${total} commands. Missing description: ${missingDesc}`))
}
