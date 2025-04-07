import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaCloudUploadAlt } from 'react-icons/fa'
import '../scss/styles.scss'

const ImageUploadCard = (props) => {
  const {
    index, // For slot images mode
    field, // (Optional for slot images)
    fieldName, // For non-slot mode (e.g. background image)
    labelText,
    watch,
    setValue,
    errors,
    isSubmitted,
    handleImageChange, // For slot images mode
    reportImageError, // For slot images mode
    previewWidth = 100,
    previewHeight = 100,
  } = props

  // Determine the key to use:
  const keyName = index !== undefined ? `images.${index}` : fieldName

  const [imageError, setImageError] = useState(false)
  const imageSrc = watch(`${keyName}.src`) || ''
  const hasError = !imageSrc || imageError

  useEffect(() => {
    if (imageSrc && !imageSrc.startsWith('data:')) {
      const img = new Image()
      img.onload = () => setImageError(false)
      img.onerror = () => setImageError(true)
      img.src = imageSrc
    }
  }, [imageSrc])

  // For non-slot mode, use internal file handler; for slot images, use the passed handler.
  const handleChangeInternal = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageError(false)
      setValue(keyName, { file, src: '' })
      const reader = new FileReader()
      reader.onloadend = () => {
        setValue(`${keyName}.src`, reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onFileChange = (e) => {
    if (index !== undefined && handleImageChange) {
      handleImageChange(index, e)
    } else {
      handleChangeInternal(e)
    }
  }

  // Report errors for slot images only
  useEffect(() => {
    if (index !== undefined && reportImageError) {
      reportImageError(index, hasError)
    }
  }, [hasError, index, reportImageError])

  let errorMsg = ''
  if (index !== undefined) {
    errorMsg = errors.images?.[index]?.src?.message
  } else if (fieldName) {
    errorMsg = errors?.[fieldName]?.src?.message
  }

  return (
    <div className="image-card">
      {/* Make entire card clickable */}
      <label htmlFor={`${keyName}-upload`} style={{ cursor: 'pointer', display: 'block' }}>
        <div
          className={`image-upload-container ${isSubmitted && hasError ? 'border-danger' : ''}`}
          style={{ overflow: 'hidden' }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            id={`${keyName}-upload`}
            style={{ display: 'none' }}
          />
          {imageSrc && !imageError ? (
            <img
              src={imageSrc}
              alt="preview"
              style={{
                width: previewWidth,
                height: previewHeight,
                objectFit: 'cover',
                maxWidth: '100%',
                maxHeight: '100%',
                margin: '5px', // Added margin for gap between image and container border
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <FaCloudUploadAlt size={48} color={isSubmitted && hasError ? '#dc3545' : undefined} />
          )}
          <div
            style={{
              textAlign: 'center',
              display: 'block',
              color: isSubmitted && hasError ? '#dc3545' : undefined,
              marginTop: '5px',
            }}
          >
            {index !== undefined
              ? `Image ${index + 1}${isSubmitted && hasError ? ' (Required)' : ''}`
              : labelText}
          </div>
          {isSubmitted && errorMsg && <div className="text-danger">{errorMsg}</div>}
        </div>
      </label>
    </div>
  )
}

ImageUploadCard.propTypes = {
  index: PropTypes.number,
  field: PropTypes.object,
  fieldName: PropTypes.string,
  labelText: PropTypes.string,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object,
  isSubmitted: PropTypes.bool.isRequired,
  handleImageChange: PropTypes.func,
  reportImageError: PropTypes.func,
  previewWidth: PropTypes.number,
  previewHeight: PropTypes.number,
}

export default ImageUploadCard
