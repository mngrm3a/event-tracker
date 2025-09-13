import fs from 'fs';
import postcss, { Root, AtRule, Declaration } from 'postcss';
import type { Plugin } from 'vite';
import colors from 'tailwindcss/colors';

interface PluginOptions {
  cssPath: string;
  outFile: string;
  resolve?: boolean;
}

// Recursive interface for nested Tailwind colors
interface ColorValueMap {
  [key: string]: string | ColorValueMap;
}

export function themeExtractorPlugin(options: PluginOptions): Plugin {
  function resolveColor(value: string): string {
    const match = value.match(/var\(--color-([a-z0-9-]+)\)/);
    if (!match) return value;

    const key = match[1]; // e.g., 'blue-300'
    const parts = key.split('-'); // ['blue', '300']

    let c: ColorValueMap | string = colors as ColorValueMap;

    for (const part of parts) {
      if (typeof c === 'string') break; // reached leaf
      if (part in c) {
        c = (c as ColorValueMap)[part];
      } else {
        return value; // fallback if key not found
      }
    }

    return typeof c === 'string' ? c : value;
  }

  function generateThemeColors() {
    const css = fs.readFileSync(options.cssPath, 'utf8');
    const root: Root = postcss.parse(css, { from: options.cssPath });

    const themeColors: Record<string, string> = {};

    root.walkAtRules('theme', (atRule: AtRule) => {
      atRule.walkDecls((decl: Declaration) => {
        if (decl.prop.startsWith('--color-')) {
          const name = decl.prop.replace('--color-', '');
          themeColors[name] = options.resolve ? resolveColor(decl.value) : decl.value;
        }
      });
    });

    const tsContent = `export const themeColors = ${JSON.stringify(themeColors, null, 2)} as const;\n`;

    fs.writeFileSync(options.outFile, tsContent);
    console.log(`Theme colors written to ${options.outFile}`);
  }

  return {
    name: 'vite-plugin-theme-extractor',
    buildStart() {
      generateThemeColors();
    },
  };
}
