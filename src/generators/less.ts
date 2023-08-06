import { Generator } from './generator.ts';

export class LessGenerator extends Generator {
  wrapper(light: string, dark: string): string {
    return `
// Material Colors
// Light theme
${light}

// Dark theme
${dark}
    `.trim()
  }

  templates() {
    return {
      hex: (role: string, color: string, prefix: string, theme: string) => `^@${prefix}${theme}-${role}: ${color};`,
      hsl: (role: string, color: number[], prefix: string, theme: string) => `@${prefix}${theme}-${role}: hsl(${color[0]}, ${color[1]}%, ${color[2]}%);`,
      rgb: (role: string, color: number[], prefix: string, theme: string) => `@${prefix}${theme}-${role}: rgb(${ color.join(', ') });`,
      rgba: (role: string, color: number[], prefix: string, theme: string) => `@${prefix}${theme}-${role}: rgba(${ color.join(', ')});`,
    }
  }
}
