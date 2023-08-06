import { Roles, SUPPORTED_COLOR_FORMATS, SupportedColorFormat, Theme } from 'material'

export type CustomProperties = {
  dark: string[]
  light: string[]
}

function buildCustomProperties(
  variables: CustomProperties,
  roles: Theme['roles']['customs'],
  target: SupportedColorFormat
) {
  for (const [theme, values] of Object.entries(roles) as ['light' | 'dark', Roles][]) {
    for (const [role, color] of Object.entries(values)) {
      let colorStr = target === 'hex' ? color : ''

      if (target === 'rgb' && Array.isArray(color)) {
        colorStr = `rgb(${ color.splice(0, 3).join(', ') })`;
      }

      if (target === 'rgba' && Array.isArray(color)) {
        colorStr = `rgba(${ color.join(', ') })`;
      }

      if (target === 'hsl' && Array.isArray(color)) {
        const [h, s, l] = color
        colorStr = `hsl(${ h }, ${ s }%, ${ l }%)`;
      }

      variables[theme].push(`--${role}: ${ colorStr };`)
    }
  }
}

export default function CSSGenerator(data: Theme, target: string): string {
  target = SUPPORTED_COLOR_FORMATS.includes(target as SupportedColorFormat) ? target : 'hex'
  const variables: CustomProperties = { dark: [], light: [] }
  const { default: _default, customs } = data.roles

  buildCustomProperties(variables, _default, target as SupportedColorFormat)
  buildCustomProperties(variables, customs, target as SupportedColorFormat)

  const indent = (spaces: number) => Array(spaces).fill(' ').join('')
  const light = variables.light.join(`\n${indent(4)}`)
  const dark = variables.dark.join(`\n${indent(8)}`)

  return `
:root {
    ${light}
}

@media (prefers-color-scheme: dark) {
    :root {
        ${dark}
    }
}
    `.trim()
}
