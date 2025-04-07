import { API_ENDPOINT } from '../../../../helpers/apiRequest'

export const populateImages = async (
  configData,
  { appendImage, removeImage, setValue, trigger, imageFieldsLength },
) => {
  // Clear existing image fields
  for (let i = imageFieldsLength - 1; i >= 0; i--) {
    removeImage(i)
  }
  // Append the required number of image fields based on configData.section
  for (let i = 0; i < configData.section; i++) {
    appendImage({ file: null, src: '' }, { shouldFocus: false })
  }
  const baseUrl = (API_ENDPOINT || '').replace(/\/$/, '')
  const convertUrlToDataUrl = async (url) => {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Network error while fetching image')
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
    } catch (err) {
      console.error('Error converting image to base64:', err)
      return ''
    }
  }
  for (let index = 0; index < configData.SlotImages.length; index++) {
    const slotImage = configData.SlotImages[index]
    const imageUrl = `${baseUrl}/media/${slotImage.image_path}`
    const dataUrl = await convertUrlToDataUrl(imageUrl)
    setValue(`images.${index}.src`, dataUrl)
    setValue(`images.${index}.file`, null)
  }
  await trigger()
}
