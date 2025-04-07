import React from 'react'
import ReactDOM from 'react-dom'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const Overlay = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <motion.div
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(0, 0, 0, 0.9)',
        zIndex: 1000, // ensure high stacking order
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        style={{
          padding: '1.5rem',
          borderRadius: '0.5rem',
          color: 'white',
          // boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          width: '80%',
          maxWidth: '335px',
          marginTop: '100px',
          alignItems: 'center',
        }}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body, // Render overlay into the document body
  )
}

Overlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
}

export default Overlay
