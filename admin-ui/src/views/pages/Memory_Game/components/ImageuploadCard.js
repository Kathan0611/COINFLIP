import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

export const ImageUploadCard = ({ name, watch, error, onChange, preview, disabled }) => {
  const fileInputRef = useRef(null)
  const fileValue = watch(name)
  const [localPreview, setLocalPreview] = useState('')

  useEffect(() => {
    if (!preview) {
      if (fileValue instanceof File) {
        const objectUrl = URL.createObjectURL(fileValue)
        setLocalPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
      } else if (typeof fileValue === 'string' && fileValue) {
        setLocalPreview(fileValue)
      } else {
        setLocalPreview('')
      }
    }
  }, [fileValue, preview])

  const handleImgError = () => {
    setLocalPreview('')
  }

  const handleUploadClick = () => {
    if (disabled) return
    fileInputRef.current.click()
  }

  const displayPreview = preview || localPreview

  return (
    <div className="image-card" style={{ position: 'relative', margin: '8px' }}>
      {displayPreview && (
        <div
          onClick={() => {
            if (!disabled) onChange(null)
          }}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            zIndex: 2,
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderRadius: '50%',
            cursor: disabled ? 'default' : 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          }}
        >
          <IoClose color="#d9534f" size={16} />
        </div>
      )}
      <div
        className={`image-upload-container ${error ? 'image-upload-error' : ''}`}
        onClick={handleUploadClick}
        style={{ cursor: disabled ? 'default' : 'pointer', textAlign: 'center' }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (!disabled) {
              onChange(e.target.files[0])
            }
          }}
          ref={fileInputRef}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        {displayPreview ? (
          <img
            src={displayPreview}
            alt=""
            onError={handleImgError}
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'cover',
              cursor: disabled ? 'default' : 'pointer',
              borderRadius: '10px',
            }}
          />
        ) : (
          <FaCloudUploadAlt size={88} />
        )}
      </div>
      {error && <div className="text-danger">{error.message || 'This field is required'}</div>}
    </div>
  )
}

ImageUploadCard.propTypes = {
  name: PropTypes.string.isRequired,
  watch: PropTypes.func.isRequired,
  error: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  preview: PropTypes.string,
  disabled: PropTypes.bool,
}

ImageUploadCard.defaultProps = {
  disabled: false,
}
