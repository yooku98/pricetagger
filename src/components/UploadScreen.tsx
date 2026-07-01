import { useProjectStore } from '../store/useProjectStore'
import { Dropzone } from './Dropzone'

export function UploadScreen() {
  const addImages = useProjectStore((s) => s.addImages)

  return (
    <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-2xl">
        <h1 className="mb-1 text-2xl font-semibold text-neutral-100">TagIt</h1>
        <p className="mb-6 text-sm text-neutral-400">Batch price tags for your product photos — upload to get started.</p>
        <Dropzone
          onFiles={(files) => void addImages(files)}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-900 px-6 py-10 text-center transition-colors hover:border-neutral-500 lg:py-16"
        >
          <svg className="mb-3 h-10 w-10 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <p className="text-sm font-medium text-neutral-200">Drop images here, or click to browse</p>
          <p className="mt-1 text-xs text-neutral-500">JPG, PNG, WebP — multiple files supported</p>
        </Dropzone>
      </div>
    </div>
  )
}
