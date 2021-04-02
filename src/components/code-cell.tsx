import { useState } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import bundleCode from '../bundler'
import Resizable from './resizable'

const CodeCell = () => {
  const [code, setCode] = useState('')
  const [input, setInput] = useState('')

  const onClick = async () => {
    const output = await bundleCode(input)
    setCode(output)
  }

  return (
    <Resizable direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue='const x = 1'
            onChange={value => setInput(value)}
          />
        </Resizable>
        {/* <div>
          <button onClick={onClick}>Submit</button>
        </div> */}
        <Preview code={code} />
      </div>
    </Resizable>
  )
}

export default CodeCell