import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSwitch,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CNavItem,
  CRow,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import FormInput from '../../../../components/FormInput'
import CustomButton from '../../../../components/Button'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CreateEditCMSValidationSchema } from '../../../../validation/cmspage-validation-schema'
import { Editor } from '@tinymce/tinymce-react'
import Dropzone from 'react-dropzone-uploader'
import {
  admincreateNewCMSPages,
  admineditcmspagecontent,
  admingetcmsPagecontentbyid,
  deleteMedia,
  getMedia,
} from '../../../../helpers/apiRequest'
import { toast } from 'react-toastify'
import 'react-dropzone-uploader/dist/styles.css'
import { authHeaderMutlipart, TinyReactPlugIns } from '../../../../utils/common'
import { CMsPagetitleConstants, titleConstants } from '../../../../constant/titleConstant'
import { FaArrowLeftLong, FaX, FaCheck } from 'react-icons/fa6'
import { FaSave } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
const AddEditCMSPage = () => {
  const [selectedMediaFile, setselectedMediaFile] = useState('')
  const [media, setMedia] = useState([])
  const [isopen, setisopen] = useState(false)
  const [selectedMediaId, setSelectedMediaId] = useState('')
  const [MediaAltText, setMediaAltText] = useState('')
  const [MediaWidth, setMediaWidth] = useState('')
  const [MediaHeight, setMediaHeight] = useState('')
  const [activeTab, setActiveTab] = useState('medialib')
  const navigate = useNavigate()
  const dropZoneRef = useRef()
  const modalRef = useRef()
  const { id } = useParams()
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(CreateEditCMSValidationSchema),
    values: {
      status: true,
    },
  })

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleCancelAction()
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getAllMedias = async () => {
    try {
      const result = await getMedia()
      if (result?.data?.status) {
        setMedia(result?.data?.data)
      }
      setTimeout(() => {
        if (!dropZoneRef?.current) {
          return
        }
        dropZoneRef?.current?.classList?.remove('dzu-previewContainer')
        dropZoneRef?.current?.classList?.add('willDeleteRef')
        dropZoneRef?.current?.classList?.remove('dzu-inputLabelWithFiles')
        dropZoneRef?.current?.classList?.add('dzu-inputLabel')
      }, 2000)
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    getAllMedias()
  }, [])
  useEffect(() => {
    if (!id) return
    const getCMSContent = async () => {
      try {
        const result = await admingetcmsPagecontentbyid(id)
        if (result?.data?.status) {
          setValue('title', result?.data?.data?.title)
          setValue('meta_title', result?.data?.data?.meta_title)
          setValue('status', result?.data?.data?.status)
          setValue('content', result?.data?.data?.content)
          setValue('meta_keywords', result?.data?.data?.meta_keywords)
          setValue('meta_desc', result?.data?.data?.meta_desc)
        } else {
          toast.error('Something Went wrong')
        }
      } catch (error) {
        toast.error(error?.response?.data?.message)
      }
    }
    getCMSContent()
  }, [id])

  const onSubmit = async (payload) => {
    try {
      if (id) {
        const result = await admineditcmspagecontent(id, payload)
        if (result?.status) {
          toast.success(result?.data?.message)
          reset()
          navigate('/cms')
        } else {
          toast.error('Something Went wrong')
        }
      } else {
        const result = await admincreateNewCMSPages(payload)
        if (result?.status) {
          toast.success(result?.data?.message)
          reset()
          navigate('/cms')
        } else {
          toast.error('Something Went wrong')
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  const getUploadParams = ({ file }) => {
    const body = new FormData()
    body.append('images', file)
    return {
      headers: authHeaderMutlipart('', ''),
      url: `${import.meta.env.VITE_APP_API_ENDPOINT}admin/media`,
      body,
    }
  }
  const handleChangeStatus = ({ xhr }) => {
    if (xhr) {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const result = JSON.parse(xhr.response)
          if (result.status) {
            toast.success(result?.message)
            getAllMedias()
            setActiveTab('medialib')
          }
        }
      }
    }
  }

  const selectMedia = (id, filepath) => {
    if (id === selectedMediaId) {
      setselectedMediaFile('')
      setSelectedMediaId('')
    } else {
      setselectedMediaFile(filepath)
      setSelectedMediaId(id)
    }
  }

  const handleDeletePopup = () => {
    if (selectedMediaId === '') {
      toast.error('Media file not selected')
    } else {
      setisopen(!isopen)
    }
  }
  const handleCancelAction = async () => {
    document.getElementById('myModal').style.display = 'none'
    setselectedMediaFile('')
    setSelectedMediaId('')
    setMediaAltText('')
    setMediaWidth('')
    setMediaHeight('')
  }

  const handleApplyAction = () => {
    if (!selectedMediaFile) return toast.error('Media file not selected')

    const img_src = `${import.meta.env.VITE_APP_MEDIA_PATH}/${selectedMediaFile}`
    const content = getValues('content')
    let styleVal
    if (MediaHeight.trim() !== '' && MediaWidth.trim() !== '') {
      styleVal = `style="height:${MediaHeight}; width:${MediaWidth}"`
    }
    let altVal = 'alt="Image"'
    if (MediaAltText.trim() !== '') {
      altVal = `alt="${MediaAltText}"`
    }
    const img = `<img ${altVal} src="${img_src}" ${styleVal}/>`
    setValue('content', content.concat(img))
    setMediaAltText('')
    setMediaWidth('')
    setMediaHeight('')
    handleCancelAction()
  }

  const handleDeleteAction = async () => {
    if (!selectedMediaId) return toast.error('Media file not selected')
    try {
      const result = await deleteMedia(selectedMediaId)
      if (result?.status) {
        toast.success(result?.data?.message)
        setselectedMediaFile('')
        setSelectedMediaId('')
        getAllMedias()
        setisopen(!isopen)
      } else {
        toast.error('Something Went wrong')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const addDefaultSrc = () => {
    ev.target.src = `${import.meta.env.VITE_APP_API_ENDPOINT}uploads/default.jpg}`
  }
  let responsive

  responsive =
    selectedMediaFile === ''
      ? {
          width: '100%',
          height: '160px',
        }
      : {
          width: '100%',
          height: '110px',
        }
  const mediaPath = import.meta.env.VITE_APP_MEDIA_PATH
  const mediaFile = selectedMediaFile
  const mediaFilesrc = `${mediaPath}/${mediaFile}`
  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className={'font-weight-bold h5'}>
            {id
              ? `${CMsPagetitleConstants.CMS_EDIT_TEXT} CMS`
              : `${CMsPagetitleConstants.ADD_CMS_TEXT} CMS`}
            <div className="card-header-actions">
              <Link to="/cms">
                <CustomButton
                  color="danger"
                  className="btn-sm"
                  labelClass={'ml-2'}
                  text={CMsPagetitleConstants.BACK_CMS_TEXT}
                  icon={<FaArrowLeftLong className="mb-1" />}
                />
              </Link>
            </div>
          </CCardHeader>

          <div id="myModal" className="modal1">
            <div className="modal-content1" ref={modalRef}>
              <CModalHeader closeButton={false} className="mb-3 mt-3">
                <CModalTitle className="ml-3">Select / Upload Media </CModalTitle>
                <FaX className="mr-2 cursor-pointer" onClick={handleCancelAction} />
              </CModalHeader>
              <CModalBody className="mb-4">
                <CTabs activeItemKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
                  <CTabList variant="tabs">
                    <CNavItem>
                      <CTab itemKey="uploadfiles">Upload Files</CTab>
                    </CNavItem>
                    <CNavItem>
                      <CTab itemKey="medialib">Media Library</CTab>
                    </CNavItem>
                  </CTabList>
                  <CTabContent>
                    <CTabPanel itemKey="uploadfiles">
                      <Dropzone
                        ref={dropZoneRef}
                        getUploadParams={getUploadParams}
                        onChangeStatus={handleChangeStatus}
                        styles={{
                          dropzone: {
                            overflow: 'auto',
                            height: '380px',
                            marginTop: '-1px',
                            borderTopWidth: '0px',
                            borderWidth: '1px',
                            borderRadius: '0px',
                          },
                          inputLabel: { color: '#c4c9d0' },
                        }}
                        canRemove={true}
                        canRestart={true}
                        accept="image/*"
                        timeout="500"
                        inputWithFilesContent="Drag Files or Click to Browse"
                      />
                    </CTabPanel>
                    <CTabPanel itemKey="medialib">
                      <CRow>
                        <CCol xl={selectedMediaFile === '' ? 12 : 9}>
                          <CRow className="pt-4 media-popup">
                            {media.length > 0 &&
                              media?.map((u, index) => (
                                <CCol xs="12" sm="6" lg="3" key={u._id}>
                                  <div
                                    className={`${selectedMediaId === u?.id && 'selected-media'} card bg-gradient-info text-white shadow-sm hover-shadow rounded p-2 m-1`}
                                    style={responsive}
                                  >
                                    <img
                                      className="sortCls mediaLibrary img-fluid"
                                      id={u._id}
                                      onError={addDefaultSrc}
                                      src={mediaPath + '/' + u?.media_path}
                                      alt="Media Image"
                                      onClick={() => {
                                        selectMedia(u.id, u.media_path)
                                      }}
                                      loading="lazy"
                                    />
                                  </div>
                                </CCol>
                              ))}
                          </CRow>
                        </CCol>
                        {selectedMediaFile !== '' && (
                          <CCol xl={3} className="custom-width">
                            <img
                              className="mt-4 mediaLibraryPreview"
                              onError={addDefaultSrc}
                              src={mediaFilesrc}
                              alt="Media Image"
                              height={20}
                              width={20}
                            />
                            <CForm>
                              <CFormLabel className="mt-3">Alt Text</CFormLabel>
                              <CFormInput
                                type="text"
                                id="media_alt_text"
                                name="media_alt_text"
                                placeholder="Alt Text"
                                autoComplete="media_alt_text"
                                value={MediaAltText}
                                onChange={(e) => setMediaAltText(e.target.value)}
                              />
                            </CForm>
                            <CForm>
                              <div style={{ display: 'flex' }}>
                                <div className="mr-2">
                                  Height
                                  <CFormInput
                                    type="text"
                                    id="media_height"
                                    name="media_height"
                                    placeholder="Height"
                                    autoComplete="media_height"
                                    value={MediaHeight}
                                    onChange={(e) => setMediaHeight(e.target.value)}
                                  />
                                </div>
                                <div>
                                  Width
                                  <CFormInput
                                    type="text"
                                    id="media_width"
                                    name="media_width"
                                    placeholder="Width "
                                    autoComplete="media_width"
                                    value={MediaWidth}
                                    onChange={(e) => setMediaWidth(e.target.value)}
                                  />
                                </div>
                              </div>
                            </CForm>
                          </CCol>
                        )}
                      </CRow>
                    </CTabPanel>
                  </CTabContent>
                </CTabs>
              </CModalBody>
              <CModalFooter className="m-4">
                {activeTab === 'medialib' && (
                  <>
                    <CustomButton
                      color="primary"
                      className="btn-sm"
                      onClick={handleApplyAction}
                      labelClass={'ml-2'}
                      text={CMsPagetitleConstants.CMS_SELECT_TEXT}
                      icon={<FaCheck className="mb-1" />}
                    />

                    <CustomButton
                      color="danger"
                      className=" btn-sm"
                      type="button"
                      text={CMsPagetitleConstants.CMS_DELETE_TEXT}
                      labelClass={'ml-2'}
                      icon={<RiDeleteBin6Line className="mb-1" />}
                      onClick={handleDeletePopup}
                    />
                  </>
                )}

                <CustomButton
                  color="secondary"
                  className="btn-sm"
                  onClick={handleCancelAction}
                  labelClass={'ml-2'}
                  text={CMsPagetitleConstants.CMS_CANCEL_TEXT}
                  icon={<IoClose className="mb-1" />}
                />
              </CModalFooter>
            </div>
            <div className="deletepopup-container">
              <CModal
                visible={isopen}
                color="danger"
                className="deletepopup"
                onClose={() => setisopen(false)}
              >
                <CModalHeader closeButton>
                  <CModalTitle>Delete Media Item</CModalTitle>
                </CModalHeader>
                <CModalBody>Are you sure you want to delete this media item?</CModalBody>
                <CModalFooter>
                  {/* <CButton color="danger" onClick={handleDeleteAction}>
                    Delete
                  </CButton>
                  <CButton color="secondary" onClick={() => setisopen(false)}>
                    Cancel
                  </CButton> */}
                  <CustomButton
                    color="danger"
                    className="btn-sm d-flex align-items-center"
                    onClick={handleDeleteAction}
                    labelClass={'ml-1'}
                    text={CMsPagetitleConstants.CMS_CONFIRM_DELETE_TEXT}
                    icon={<RiDeleteBin6Line />}
                  />
                  <CustomButton
                    color="secondary"
                    className="btn-sm d-flex align-items-center "
                    onClick={() => setisopen(false)}
                    labelClass={'ml-1'}
                    text={CMsPagetitleConstants.CMS_CANCEL_TEXT}
                    icon={<IoClose />}
                  />
                </CModalFooter>
              </CModal>
            </div>
          </div>
          <input id="my-file" type="file" name="my-file" style={{ display: 'none' }} />

          <CForm onSubmit={handleSubmit(onSubmit)} className="admin-add">
            <CCardBody>
              <CInputGroup className="row">
                <div className="mb-3 col-sm-4">
                  <FormInput
                    {...register('title')}
                    placeholder="Title"
                    autoComplete="title"
                    error={errors?.title?.message}
                    disabled={isSubmitting}
                    label={' Title'}
                  />
                </div>
                <div className="mb-3 col-sm-4">
                  <FormInput
                    {...register('meta_title')}
                    placeholder="Meta title"
                    autoComplete="title"
                    error={errors?.meta_title?.message}
                    disabled={isSubmitting}
                    label={'Meta title'}
                  />
                </div>
                <div className="mb-3 col-sm-4">
                  <FormInput
                    {...register('meta_desc')}
                    placeholder="Meta description"
                    autoComplete="desc"
                    error={errors?.meta_desc?.message}
                    disable={isSubmitting}
                    label={'Meta description'}
                  />
                </div>
              </CInputGroup>
              <CInputGroup className="row">
                <div className="mb-3 col-sm-4">
                  <FormInput
                    {...register('meta_keywords')}
                    placeholder="Meta keywords"
                    autoComplete="keywords"
                    error={errors?.meta_keywords?.message}
                    disabled={isSubmitting}
                    label={'Meta keywords'}
                  />
                </div>

                <div className="mb-3 col-sm-4">
                  <CFormLabel htmlFor="status" className="mb-1">
                    Status
                  </CFormLabel>
                  <CFormSwitch
                    name="status"
                    className="custom-status-switch"
                    color="primary"
                    {...register('status')}
                  />
                </div>
              </CInputGroup>
              <CInputGroup className="row  ml-1">
                <Controller
                  name="content"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Editor
                      apiKey={import.meta.env.VITE_APP_TINYMCE_API_KEY}
                      value={field.value}
                      onEditorChange={field.onChange}
                      init={{
                        placeholder: 'Enter Description',
                        height: 500,
                        plugins: TinyReactPlugIns,
                        toolbar:
                          'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link preview myCustomToolbarButton',
                        file_browser_callback_types: 'image',
                        file_picker_callback(callback, value, meta) {
                          if (meta.filetype !== 'image') return

                          const input = document.getElementById('my-file')
                          input.click()
                          input.onchange = () => {
                            const file = input.files[0]
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              callback(e.target.result, { alt: file.name })
                            }
                            reader.readAsDataURL(file)
                          }
                        },
                        paste_data_images: true,
                        setup(editor) {
                          const modal = document.getElementById('myModal')
                          const span = document.getElementsByClassName('close')[0]

                          editor.ui.registry.addButton('myCustomToolbarButton', {
                            icon: 'gallery',
                            tooltip: 'Insert images',
                            onAction() {
                              modal.style.display = 'block'
                              span.onclick = () => {
                                modal.style.display = 'none'
                              }
                              window.onclick = (event) => {
                                if (event.target === modal) {
                                  modal.style.display = 'none'
                                }
                              }
                            },
                          })
                        },
                      }}
                    />
                  )}
                />
                {errors?.content && (
                  <CFormFeedback className="invalid-feedback d-block" invalid>
                    {errors.content.message}
                  </CFormFeedback>
                )}
              </CInputGroup>
            </CCardBody>
            <CCardFooter>
              <CustomButton
                color="primary"
                disabled={isSubmitting}
                type="submit"
                className=" mt-1 btn-sm"
                text={
                  isSubmitting
                    ? titleConstants.BUTTON_SUBMITTING_TITLE
                    : titleConstants.BUTTON_SUBMIT_TITLE
                }
                icon={<FaSave className="mb-1 mr-1" />}
              />
              &nbsp;
              <Link to={'/cms'}>
                <CustomButton
                  icon={<IoClose className="mb-1 mr-1" size={'16px'} />}
                  color="danger"
                  className="mt-1 btn-sm"
                  type="button"
                  text={CMsPagetitleConstants.CMS_CANCEL_TEXT}
                  labelClass={'ml-1'}
                />
              </Link>
            </CCardFooter>
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddEditCMSPage
