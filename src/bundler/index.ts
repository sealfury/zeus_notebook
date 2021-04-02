import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg_path_plugin'
import { fetchPlugin } from './plugins/fetch_plugin'

let service: esbuild.Service

const bundleCode = async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    })
  }

  const result = await service.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window', // done automatically by webpack but needed here
    },
  })

  return result.outputFiles[0].text
}

export default bundleCode