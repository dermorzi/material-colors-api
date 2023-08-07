import { indent } from "utils";
import { Generator } from './generator.ts'

export class CSSGenerator extends Generator {
  wrapper(light: string, dark: string) {
    return (`
:root {
    ${light}
}

@media (prefers-color-scheme: dark) {
    :root {
        ${dark}
    }
}
    `).trim()
  }

  templates() {
    return {
      hex: (role: string, color: string, prefix: string, _: string) => `--${prefix || ''}${role}: ${color};`,
      hsl: (role: string, color: number[], prefix: string, _: string) => `--${prefix || ''}${role}: hsl(${color[0]}, ${color[1]}%, ${color[2]}%);`,
      rgb: (role: string, color: number[], prefix: string, _: string) => `--${prefix || ''}${role}: rgb(${ color.join(', ') });`,
      rgba: (role: string, color: number[], prefix: string, _: string) => `--${prefix || ''}${role}: rgba(${ color.join(', ')});`,
    }
  }

  indentVariables(): { light: string, dark: string } {
    return {
      light: this.variables.light.join(`\n${indent(4)}`),
      dark: this.variables.dark.join(`\n${indent(8)}`),
    }
  }
}
