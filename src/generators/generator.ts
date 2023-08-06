import { Roles, SUPPORTED_COLOR_FORMATS, SupportedColorFormat, Theme } from "material";
import { ThemeVariables } from "./types.ts";

export type VariableTemplates = {
  hex?: (role: string, color: string, prefix: string, theme: string) => string
  hsl?: (role: string, color: number[], prefix: string, theme: string) => string
  rgb?: (role: string, color: number[], prefix: string, theme: string) => string
  rgba?: (role: string, color: number[], prefix: string, theme: string) => string
}

export class Generator {
  prefix: string
  roles: Theme['roles']
  target: SupportedColorFormat
  variables: ThemeVariables

  constructor(theme: Theme, target: unknown, prefix?: string | string[]) {
      this.prefix = prefix ? (Array.isArray(prefix) ?  prefix[0] : prefix) + '-' : ''
      this.roles = theme.roles
      this.target = SUPPORTED_COLOR_FORMATS.includes(target as SupportedColorFormat)
        ? target as SupportedColorFormat
        : 'hex'
      this.variables  = { dark: [], light: [] }
  }

  wrapper(light: string, dark: string): string {
    return `
${light}
${dark}
    `
  }

  templates(): VariableTemplates {
    return {}
  }

  indentVariables() {
    return {
      light: this.variables.light.join('\n'),
      dark: this.variables.dark.join('\n'),
    }
  }

  protected buildVariables(type: 'default' | 'customs'): void {
    const tmpl = this.templates()

    for (const [theme, values] of Object.entries(this.roles[type]) as ['light' | 'dark', Roles][]) {
      for (const [role, color] of Object.entries(values)) {
        if (typeof color === 'number') {
          continue
        }

        if (typeof color === 'string') {
          if (this.target === 'hex' && 'hex' in tmpl) {
            const variable = tmpl[this.target]?.(role, color, this.prefix, theme)
            if (variable) {
              this.variables[theme].push(variable)
            }
          }
          continue
        }

        if (tmpl[this.target] && this.target !== 'hex') {
          const variable = tmpl[this.target]?.(role, color, this.prefix, theme)
          if (variable) {
            this.variables[theme].push(variable)
          }
        }
      }
    }
  }

  build(): string {
    this.buildVariables('default')
    this.buildVariables('customs')
    const { light, dark } = this.indentVariables()
    return this.wrapper(light, dark)
  }
}
