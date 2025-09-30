import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  CloudUpload,
  Close,
  AttachFile,
  Warning,
  InsertDriveFile,
  Image as ImageIcon,
  VideoFile
} from '@mui/icons-material'
import type { MaintenanceFile } from '../../types/maintenance'

interface FileUploadProps {
  files: MaintenanceFile[]
  onFilesChange: (files: File[]) => void
  onFileRemove: (fileId: string) => void
  maxFiles?: number
  maxSizeInMB?: number
  acceptedTypes?: string[]
  disabled?: boolean
}

const MaintenanceFileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  onFileRemove,
  maxFiles = 5,
  maxSizeInMB = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  disabled = false
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) return

      // Filter files by size
      const validFiles = acceptedFiles.filter(file => {
        const sizeInMB = file.size / (1024 * 1024)
        return sizeInMB <= maxSizeInMB
      })

      // Limit total files
      const remainingSlots = maxFiles - files.length
      const filesToAdd = validFiles.slice(0, remainingSlots)

      if (filesToAdd.length > 0) {
        onFilesChange(filesToAdd)
      }
    },
    [files.length, maxFiles, maxSizeInMB, onFilesChange, disabled]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize: maxSizeInMB * 1024 * 1024,
    maxFiles: maxFiles - files.length,
    disabled
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: MaintenanceFile) => {
    if (file.isImage) return <ImageIcon className="w-5 h-5 text-blue-600" />
    if (file.isVideo) return <VideoFile className="w-5 h-5 text-purple-600" />
    if (file.fileType?.includes('pdf')) return <InsertDriveFile className="w-5 h-5 text-red-600" />
    return <AttachFile className="w-5 h-5 text-gray-600" />
  }

  return (
    <div className="w-full">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />

        {isDragActive ? (
          <p className="text-blue-600 font-medium">Suelte los archivos aquí...</p>
        ) : (
          <div>
            <p className="text-gray-600 font-medium mb-2">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500">
              Máximo {maxFiles} archivos, {maxSizeInMB}MB cada uno
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Formatos: Imágenes, PDF, DOC, DOCX
            </p>
          </div>
        )}
      </div>

      {/* File rejection errors */}
      {fileRejections.length > 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-700 mb-2">
            <Warning className="w-5 h-5 mr-2" />
            <span className="font-medium">Archivos rechazados:</span>
          </div>
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="text-sm text-red-600 ml-7">
              <strong>{file.name}</strong>:
              {errors.map(error => (
                <span key={error.code} className="ml-1">
                  {error.code === 'file-too-large' && `Archivo muy grande (máx. ${maxSizeInMB}MB)`}
                  {error.code === 'file-invalid-type' && 'Tipo de archivo no permitido'}
                  {error.code === 'too-many-files' && `Máximo ${maxFiles} archivos`}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Archivos adjuntos ({files.length}/{maxFiles})
          </h4>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.fileSize)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onFileRemove(file.id)}
                className="ml-3 p-1 text-gray-400 hover:text-red-600 transition-colors"
                disabled={disabled}
              >
                <Close className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload limits info */}
      {files.length >= maxFiles && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center text-yellow-800">
            <Warning className="w-5 h-5 mr-2" />
            <span className="text-sm">
              Has alcanzado el límite máximo de {maxFiles} archivos
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaintenanceFileUpload