'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { createClient } from '@/shared/lib/supabase/client'

export interface LogoUploadZoneProps {
  currentLogoUrl: string | null
  onUploadComplete: (url: string) => void
  onRemove: () => void
}

export function LogoUploadZone({
  currentLogoUrl,
  onUploadComplete,
  onRemove,
}: LogoUploadZoneProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentLogoUrl)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/svg+xml': [],
    },
    maxSize: 2 * 1024 * 1024,
    multiple: false,
    disabled: uploading,
    onDropAccepted: async ([file]) => {
      setError(null)
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      setUploading(true)

      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        const ext = file.name.split('.').pop() ?? 'png'
        const path = `logos/${user.id}/logo-${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(path, file, { upsert: true })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from('logos').getPublicUrl(path)
        const publicUrl = urlData.publicUrl

        setPreview(publicUrl)
        onUploadComplete(publicUrl)
      } catch {
        setError('Upload failed. Please try again.')
        setPreview(currentLogoUrl)
      } finally {
        setUploading(false)
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0]
      if (rejection?.errors[0]?.code === 'file-too-large') {
        setError('File is too large. Maximum size is 2MB.')
      } else if (rejection?.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload a PNG, JPG, or SVG.')
      } else {
        setError('File rejected. Please check the file and try again.')
      }
    },
  })

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    setPreview(null)
    setError(null)
    onRemove()
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={[
          'relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors duration-200',
          isDragActive
            ? 'border-(--blue-600) bg-(--blue-50)'
            : 'border-(--border-strong) bg-(--surface-raised) hover:border-(--blue-400) hover:bg-(--blue-50)',
          uploading ? 'cursor-not-allowed opacity-70' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input {...getInputProps()} />

        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Business logo"
              className="max-h-[100px] max-w-[200px] rounded-lg object-contain"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70">
                <Loader2 className="h-6 w-6 animate-spin text-(--blue-600)" />
              </div>
            )}
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                aria-label="Remove logo"
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-(--ink-900) text-white shadow-sm transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ink-900) focus-visible:ring-offset-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </>
        ) : (
          <>
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-(--blue-600)" />
            ) : (
              <UploadCloud
                className={[
                  'h-8 w-8 transition-colors duration-200',
                  isDragActive ? 'text-(--blue-600)' : 'text-(--ink-300)',
                ].join(' ')}
              />
            )}
            <div className="text-center">
              <p className="text-[13px] font-medium text-(--ink-700) [font-family:var(--font-body)]">
                {isDragActive ? 'Drop your logo here' : 'Drag & drop or click to upload'}
              </p>
              <p className="mt-0.5 text-[11px] text-(--ink-300) [font-family:var(--font-body)]">
                PNG, JPG or SVG · Max 2MB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-(--error) [font-family:var(--font-body)]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
