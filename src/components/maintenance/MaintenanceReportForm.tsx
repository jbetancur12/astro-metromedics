import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Build,
  CheckCircle,
  Send,
  Error,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material'
import MaintenanceFileUpload from './MaintenanceFileUpload'
import { maintenanceApi } from '../../services/maintenanceApi'
import type {
  MaintenanceCreateRequest
} from '../../types/maintenance'
import {
  MaintenancePriority,
  EQUIPMENT_TYPES
} from '../../types/maintenance'

const validationSchema = Yup.object({
  customerName: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .required('El nombre es requerido'),
  customerEmail: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  customerPhone: Yup.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .required('El teléfono es requerido'),
  equipmentType: Yup.string().required('El tipo de equipo es requerido'),
  equipmentBrand: Yup.string().required('La marca es requerida'),
  equipmentModel: Yup.string().required('El modelo es requerido'),
  equipmentSerial: Yup.string().required('El número de serie es requerido'),
  issueDescription: Yup.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .required('La descripción del problema es requerida'),
  location: Yup.string().required('La ubicación es requerida')
})

const steps = [
  'Información Personal',
  'Datos del Equipo',
  'Descripción del Problema',
  'Confirmación'
]

const MaintenanceReportForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean
    ticketNumber?: string
    message: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik<MaintenanceCreateRequest>({
    initialValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      equipmentType: '',
      equipmentBrand: '',
      equipmentModel: '',
      equipmentSerial: '',
      issueDescription: '',
      location: '',
      files: []
    },
    validationSchema,
    onSubmit: async (values: MaintenanceCreateRequest) => {
      try {
        setIsLoading(true)
        const submitData = {
          ...values,
          priority: MaintenancePriority.MEDIUM,
          files: files
        }

        const result = await maintenanceApi.createTicket(submitData)

        setSubmissionResult({
          success: true,
          ticketNumber:
            result?.ticketNumber || result?.ticket?.ticketCode || 'Sin número',
          message:
            'Solicitud enviada exitosamente. Su ticket ha sido creado y está pendiente de asignación. Recibirá una confirmación por email.'
        })

        // Reset form
        formik.resetForm()
        setFiles([])
        setActiveStep(0)
      } catch (error: any) {
        console.error('Maintenance form submission error:', error)
        let errorMessage = 'Error al enviar la solicitud. Intente nuevamente.'

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error
        } else if (error.message) {
          errorMessage = error.message
        }

        setSubmissionResult({
          success: false,
          message: errorMessage
        })
      } finally {
        setIsLoading(false)
      }
    }
  })

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleFilesChange = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return (
          !formik.errors.customerName &&
          !formik.errors.customerEmail &&
          !formik.errors.customerPhone &&
          formik.values.customerName &&
          formik.values.customerEmail &&
          formik.values.customerPhone
        )
      case 1:
        return (
          !formik.errors.equipmentType &&
          !formik.errors.equipmentBrand &&
          !formik.errors.equipmentModel &&
          !formik.errors.equipmentSerial &&
          formik.values.equipmentType &&
          formik.values.equipmentBrand &&
          formik.values.equipmentModel &&
          formik.values.equipmentSerial
        )
      case 2:
        return (
          !formik.errors.issueDescription &&
          !formik.errors.location &&
          formik.values.issueDescription &&
          formik.values.location
        )
      case 3:
        return true
      default:
        return false
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Información de Contacto
              </h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="customerName"
                value={formik.values.customerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.customerName && formik.errors.customerName
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Ingrese su nombre completo"
              />
              {formik.touched.customerName && formik.errors.customerName && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formik.values.customerEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.customerEmail && formik.errors.customerEmail
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="correo@ejemplo.com"
              />
              {formik.touched.customerEmail && formik.errors.customerEmail && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.customerEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formik.values.customerPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.customerPhone && formik.errors.customerPhone
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="3001234567"
              />
              {formik.touched.customerPhone && formik.errors.customerPhone && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.customerPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación del Equipo *
              </label>
              <input
                type="text"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.location && formik.errors.location
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Ej: Quirófano 1, UCI, Laboratorio"
              />
              {formik.touched.location && formik.errors.location && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.location}</p>
              )}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Información del Equipo
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Equipo *
              </label>
              <select
                name="equipmentType"
                value={formik.values.equipmentType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.equipmentType && formik.errors.equipmentType
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione un tipo</option>
                {EQUIPMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {formik.touched.equipmentType && formik.errors.equipmentType && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.equipmentType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca *
              </label>
              <input
                type="text"
                name="equipmentBrand"
                value={formik.values.equipmentBrand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.equipmentBrand && formik.errors.equipmentBrand
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Ej: Philips, GE, Siemens"
              />
              {formik.touched.equipmentBrand && formik.errors.equipmentBrand && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.equipmentBrand}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo *
              </label>
              <input
                type="text"
                name="equipmentModel"
                value={formik.values.equipmentModel}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.equipmentModel && formik.errors.equipmentModel
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Modelo del equipo"
              />
              {formik.touched.equipmentModel && formik.errors.equipmentModel && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.equipmentModel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Serie *
              </label>
              <input
                type="text"
                name="equipmentSerial"
                value={formik.values.equipmentSerial}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.equipmentSerial && formik.errors.equipmentSerial
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Número de serie del equipo"
              />
              {formik.touched.equipmentSerial && formik.errors.equipmentSerial && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.equipmentSerial}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Descripción del Problema
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describa el problema detalladamente *
              </label>
              <textarea
                name="issueDescription"
                rows={4}
                value={formik.values.issueDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  formik.touched.issueDescription && formik.errors.issueDescription
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Describa detalladamente el problema que presenta el equipo, síntomas, códigos de error, etc."
              />
              {formik.touched.issueDescription && formik.errors.issueDescription && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.issueDescription}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivos Adjuntos (Opcional)
              </label>
              <MaintenanceFileUpload
                files={files.map((file, index) => ({
                  id: index.toString(),
                  ticketId: '',
                  fileName: file.name,
                  originalName: file.name,
                  fileType: file.type,
                  fileSize: file.size,
                  filePath: '',
                  uploadedBy: '',
                  uploadedAt: '',
                  isImage: file.type.startsWith('image/'),
                  isVideo: file.type.startsWith('video/')
                }))}
                onFilesChange={handleFilesChange}
                onFileRemove={(fileId) => handleFileRemove(parseInt(fileId))}
                maxFiles={5}
                maxSizeInMB={10}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirmación de Datos
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Información de Contacto</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Nombre:</strong> {formik.values.customerName}</p>
                  <p><strong>Email:</strong> {formik.values.customerEmail}</p>
                  <p><strong>Teléfono:</strong> {formik.values.customerPhone}</p>
                  <p><strong>Ubicación:</strong> {formik.values.location}</p>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Información del Equipo</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Tipo:</strong> {formik.values.equipmentType}</p>
                  <p><strong>Marca:</strong> {formik.values.equipmentBrand}</p>
                  <p><strong>Modelo:</strong> {formik.values.equipmentModel}</p>
                  <p><strong>Serie:</strong> {formik.values.equipmentSerial}</p>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Problema Reportado</h4>
                <p className="text-sm text-gray-600">{formik.values.issueDescription}</p>
              </div>

              {files.length > 0 && (
                <>
                  <hr className="border-gray-200" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Archivos Adjuntos</h4>
                    <div className="flex flex-wrap gap-2">
                      {files.map((file, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {file.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (submissionResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {submissionResult.success ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                ¡Solicitud Enviada!
              </h2>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Número de Ticket: <span className="text-blue-600">{submissionResult.ticketNumber}</span>
              </h3>
              <p className="text-gray-600 mb-4">
                {submissionResult.message}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Puede hacer seguimiento de su solicitud usando el número de
                ticket en la página de seguimiento.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/mantenimiento/seguimiento"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Hacer Seguimiento
                </a>
                <button
                  onClick={() => setSubmissionResult(null)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Nueva Solicitud
                </button>
              </div>
            </>
          ) : (
            <>
              <Error className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Error al Enviar
              </h2>
              <p className="text-gray-600 mb-6">
                {submissionResult.message}
              </p>
              <button
                onClick={() => setSubmissionResult(null)}
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Intentar Nuevamente
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-center">
          <Build className="w-12 h-12 text-white mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Solicitud de Mantenimiento
          </h1>
          <p className="text-blue-100">
            Complete el siguiente formulario para reportar un problema con su equipo médico
          </p>
        </div>

        {/* Stepper */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    ${
                      index <= activeStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {index + 1}
                </div>
                <span
                  className={`
                    ml-3 text-sm font-medium
                    ${
                      index <= activeStep ? 'text-blue-600' : 'text-gray-500'
                    }
                  `}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      ml-6 w-16 h-0.5
                      ${
                        index < activeStep ? 'bg-blue-600' : 'bg-gray-200'
                      }
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="px-8 py-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center text-blue-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-3"></div>
              <span className="text-sm font-medium">Enviando solicitud...</span>
            </div>
          </div>
        )}

        {/* Form content */}
        <form onSubmit={formik.handleSubmit}>
          <div className="px-8 py-8">
            {renderStepContent(activeStep)}
          </div>

          {/* Navigation buttons */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              disabled={activeStep === 0}
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowBack className="w-4 h-4 mr-2" />
              Anterior
            </button>

            {activeStep === steps.length - 1 ? (
              <button
                type="submit"
                disabled={!formik.isValid || isLoading}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Solicitud
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid(activeStep)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <ArrowForward className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default MaintenanceReportForm