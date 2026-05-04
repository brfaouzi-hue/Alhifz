import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

let babelTransform = null

const preJSXLoad = {
  name: 'pre-jsx-load',
  enforce: 'pre',
  configResolved(config) {
    const reactPlugin = config.plugins.find(p => p.name === 'vite:react-babel')
    if (reactPlugin && reactPlugin.transform) {
      babelTransform = reactPlugin.transform.bind({ ...this, getModuleInfo: () => null })
    }
  },
  async load(id) {
    if (babelTransform && !id.includes('node_modules') && id.endsWith('.jsx')) {
      try {
        const code = readFileSync(id, 'utf8')
        const result = await babelTransform(code, id)
        if (result && result.code) return result
      } catch(e) {}
    }
    return null
  }
}

export default defineConfig({
  plugins: [preJSXLoad, react()]
})
