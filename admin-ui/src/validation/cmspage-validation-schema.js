import * as yup from 'yup'

export const CreateEditCMSValidationSchema = yup.object().shape({
  content: yup.string().required('Content is required'),

  title: yup
    .string()
    .required('Title is required')
    .max(255, 'Title must be at most 255 characters'),
  meta_title: yup
    .string()
    .required('Meta title is required')
    .max(255, 'Meta title must be at most 255 characters'),
  meta_desc: yup
    .string()
    .required('Meta description is required')
    .max(255, 'Meta description must be at most 255 characters'),
  meta_keywords: yup
    .string()
    .required('Meta keywords are required')
    .max(255, 'Meta keywords must be at most 255 characters'),
  status: yup.boolean().optional(),
})
