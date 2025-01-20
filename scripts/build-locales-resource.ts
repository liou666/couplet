import { readdirSync, writeFileSync } from 'fs'
import { basename, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function buildLocalesResource() {
  const localesDir = join(__dirname, '..', 'locales')
  const files = readdirSync(localesDir).filter(file => file.endsWith('.json'))

  const generateImportStatements = (files: string[]): string =>
    files.map(file => `import ${basename(file, '.json').replace('-', '_')} from '@locales/${file}'`).join('\n')

  const generateResourceEntries = (files: string[]): string =>
    files.map((file) => {
      const langKey = basename(file, '.json').replace('-', '_')
      return `  ${langKey}: {\n    translation: ${langKey},\n  },`
    }).join('\n')

  const langKeys = files.map(file => basename(file, '.json').replace('-', '_'))

  const content = `// This file is auto generated by scripts/build-locales-resource.ts
// Don't modify it manually.

${generateImportStatements(files)}

export const resources = {
${generateResourceEntries(files)}
}

export type Resources = (typeof resources)['${langKeys[0]}']

export const supportLangs: string[] = [${langKeys.map(key => `'${key}'`).join(', ')}]
`

  const outputPath = join(__dirname, '..', 'apps', 'shared', '@types', 'resources.ts')
  writeFileSync(outputPath, content)
  console.log(`[DONE] Resources file generated at: ${outputPath}`)
}

buildLocalesResource()
