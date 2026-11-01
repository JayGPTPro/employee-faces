import type { Hook, Register } from 'claude-code'

import { DONNA_PNG, WONKA_PNG } from './avatars'
import { detect, type Who } from './detect'

type Persona = { name: string; color: string; png: string; emoji: string; words: string[] }

const TEAM: Record<Who, Persona> = {
  Donna: {
    name: 'Donna',
    color: '#E8743B',
    png: DONNA_PNG,
    emoji: '💁‍♀️',
    words: ['Handling it', 'Reading your inbox', 'Already on it', 'Knowing everything', 'Fixing your mess'],
  },
  Wonka: {
    name: 'Wonka',
    color: '#D9A93A',
    png: WONKA_PNG,
    emoji: '🎩',
    words: ['Stirring the chocolate river', 'Inventing', 'Polishing the golden ticket', 'Running the factory'],
  },
}

function svgOf(png: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><image width="128" height="128" href="data:image/png;base64,${png}"/></svg>`
}

let cachedCwd: string | null = null
let persona: Persona | null = null
let svg = ''

// The desktop app starts a spare process in a temp folder and attaches the session later,
// so the folder is looked up when drawing, never only at session.start
async function current($: Parameters<Hook<'ui.render'>>[0]): Promise<Persona | null> {
  const cwd = await $.session.cwd()
  if (cwd !== cachedCwd) {
    cachedCwd = cwd
    const who = await detect(cwd, {
      exists: path => $.fs.exists(path),
      read: path => $.fs.read(path),
    }).catch(() => null)
    persona = who ? TEAM[who] : null
    svg = persona ? svgOf(persona.png) : ''
  }
  return persona
}

export const register: Register = on => {
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (!e.props.isFirstOfReply) {
      return next(e)
    }

    const persona = await current($)
    if (!persona) {
      return next(e)
    }

    const body = await next(e)
    const { Text } = $.ui.resolve(e)
    const name = (
      <Text color={persona.color} bold>
        {persona.name}
      </Text>
    )

    if (e.surface === 'terminal') {
      const { Box, Image } = $.ui.resolve(e)
      return (
        <Box flexDirection="column">
          <Box gap={1}>
            <Image source={{ png: persona.png }} columns={2} rows={1} alt={persona.emoji} />
            {name}
          </Box>
          {body}
        </Box>
      )
    }

    if (e.surface === 'desktop' || e.surface === 'vscode' || e.surface === 'mobile') {
      const { Box, Svg } = $.ui.resolve(e)
      return (
        <Box flexDirection="column">
          <Box gap={1} alignItems="center">
            <Svg source={svg} alt={persona.name} width={26} height={26} />
            {name}
          </Box>
          {body}
        </Box>
      )
    }

    return body
  })

  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    // On the desktop the word names the current step; keep it unless it is the bare "Working"
    const isGeneric = e.surface === 'terminal' || e.props.word === 'Working'
    if (e.props.message !== null || !isGeneric) {
      return next(e)
    }

    const persona = await current($)
    if (!persona) {
      return next(e)
    }

    const word = persona.words[e.requestId.length % persona.words.length] ?? 'Working'

    return next({ ...e, props: { ...e.props, word } })
  })
}
