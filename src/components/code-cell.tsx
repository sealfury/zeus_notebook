import { useState, useEffect } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import bundleCode from '../bundler'
import Resizable from './resizable'

const CodeCell = () => {
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [input, setInput] = useState('')

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundleCode(input)
      setCode(output.code)
      setErr(output.err)
    }, 1000) 

    return () => {
      clearTimeout(timer)
    }
  }, [input])

  return (
    <Resizable direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue='const x = 1'
            onChange={value => setInput(value)}
          />
        </Resizable>
        <Preview code={code} error={err} />
      </div>
    </Resizable>
  )
}

export default CodeCell
