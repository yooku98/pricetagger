import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface DropzoneProps {
  onFiles: (files: File[]) => void
  className?: string
  children: ReactNode
}

export function Dropzone({ onFiles, className, children }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFileList(fileList: FileList | null) {
    if (!fileList) return
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (files.length) onFiles(files)
  }

  return (
    <div
      className={`${className ?? ''} ${isDragging ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileList(e.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
    >
      {children}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFileList(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
