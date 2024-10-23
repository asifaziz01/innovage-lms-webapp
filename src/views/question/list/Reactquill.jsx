import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './quill.css'
const Reactquill = ({ value, onChange, onKeyPress, placeholder, height }) => {
  const [values, setValues] = useState(value)

  // Sync the initial value passed into the component
  useEffect(() => {
    setValues(value)
  }, [value])

  // Define the modules for the toolbar
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'align',
    'color',
    'background',
    'link',
    'image',
    'video'
  ]

  // Handle content changes
  const handleChange = (content, delta, source, editor) => {
    setValues(content) // Update the internal state
    onChange(content) // Pass the content back to the parent component
  }

  return (
    <div style={{ overflow: 'auto' }}>
      <ReactQuill
        theme='snow'
        value={values}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Reactquill