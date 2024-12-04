import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const RULES_PATH = path.join(process.cwd(), 'src/utils/rules.ts')

export async function POST(req: Request) {
  try {
    const { profile, rules } = await req.json()

    const fileContent = `
export const rules = ${JSON.stringify(rules, null, 2)};

export const profile = \`
${profile}
\`;
`

    await fs.writeFile(RULES_PATH, fileContent)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save settings:', error)
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 })
  }
} 