export type Who = 'Donna' | 'Wonka'

type Fs = {
  exists: (path: string) => Promise<boolean>
  read: (path: string) => Promise<string>
}

// Newer kits carry a character file; every kit's CLAUDE.md names its employee near the top
const MARKERS: Array<[string, Who]> = [
  ['.claude/wonka-character.md', 'Wonka'],
  ['.claude/donna-character.md', 'Donna'],
]

function whoInClaudeMd(text: string): Who | null {
  const head = text.slice(0, 800)
  if (/You are \*\*Willy Wonka\*\*/.test(head)) return 'Wonka'
  if (/Donna's instructions|ההוראות והאישיות של דונה/.test(head)) return 'Donna'
  return null
}

// The nearest folder that holds a kit marker or a CLAUDE.md decides, walking up from cwd
export async function detect(cwd: string, fs: Fs): Promise<Who | null> {
  let dir = cwd.replace(/\/+$/, '')

  for (let depth = 0; depth < 8 && dir !== ''; depth++) {
    for (const [file, who] of MARKERS) {
      if (await fs.exists(`${dir}/${file}`)) return who
    }

    const claudeMd = `${dir}/CLAUDE.md`
    if (await fs.exists(claudeMd)) {
      return whoInClaudeMd(await fs.read(claudeMd))
    }

    dir = dir.slice(0, dir.lastIndexOf('/'))
  }

  return null
}
