import './code-editor.css'
import { useRef } from 'react'
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react'
import prettier from 'prettier'
import parser from 'prettier/parser-babel'
interface CodeEditorProps {
  initialValue: string
  onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<any>()

  const onEditorDidMount: EditorDidMount = (getCurrentValue, monacoEditor) => {
    editorRef.current = monacoEditor
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getCurrentValue())
    })

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 })
  }

  const onFormatClick = () => {
    // get current val from editor
    const unformatted = editorRef.current.getModel().getValue()

    // format value
    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: false, // maybe change this later
        singleQuote: true,
      })
      .replace(/\n$/, '')

    // set formatted val in editor
    editorRef.current.setValue(formatted)
  }

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        theme='vs-dark'
        language='javascript'
        height='500px'
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}

export default CodeEditor
