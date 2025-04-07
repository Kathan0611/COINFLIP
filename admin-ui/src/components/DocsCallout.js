import PropTypes from 'prop-types'
import React from 'react'
import { CCallout, CLink } from '@coreui/react'

const DocsCallout = (props) => {
  const { content, href, name } = props

  const plural = name.slice(-1) === 's'

  const _href = `https://coreui.io/react/docs/${href}`

  // Compute the appropriate messages
  const componentVerb = plural ? 'have' : 'has'
  const nameVerb = plural ? 'are' : 'is'

  // Default message if content is not provided
  const defaultContent = `A React ${name} component ${componentVerb} been created as a native React.js version
  of Bootstrap ${name}. ${name} ${nameVerb} delivered with some new features,
  variants, and unique design that matches CoreUI Design System requirements.`

  return (
    <CCallout color="info" className="bg-white">
      {content || defaultContent}
      <br />
      <br />
      For more information please visit our official{' '}
      <CLink href={_href} target="_blank">
        documentation of CoreUI Components Library for React.js
      </CLink>
      .
    </CCallout>
  )
}

DocsCallout.propTypes = {
  content: PropTypes.string,
  href: PropTypes.string,
  name: PropTypes.string,
}

export default React.memo(DocsCallout)
