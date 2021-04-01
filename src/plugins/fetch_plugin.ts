import * as esbuild from 'esbuild-wasm'
import axios from 'axios'
import localForage from 'localforage'

const fileCache = localForage.createInstance({
  name: 'filecache',
})

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          }
        }

        // // Check if file has been fetched & is in cache
        // const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
        //   args.path
        // )

        // // If so, return immediately
        // if (cachedResult) {
        //   return cachedResult
        // }

        const { data, request } = await axios.get(args.path)

        const fileType = args.path.match(/.css$/) ? 'css' : 'jsx'

        const escapedCss = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")

        const contents =
          fileType === 'css'
            ? `
            const style = document.createElement('style')
            style.innerText = '${escapedCss}'
            document.head.appendChild(style)
          `
            : data

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        }
        // store response in cache
        await fileCache.setItem(args.path, result)

        return result
      })
    },
  }
}
