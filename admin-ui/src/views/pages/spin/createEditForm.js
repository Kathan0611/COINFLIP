import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormLabel,
  CFormSwitch,
  CInputGroup,
  CRow,
} from '@coreui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomButton from '../../../components/Button';
import FormInput from '../../../components/FormInput';
import { showToastr } from '../../../components/ToastrNotification';
import { StorePagetitleConstants } from '../../../constant/titleConstant';
import { createNewStore, getStoreData, updateStoreData } from '../../../helpers/apiRequest';
import { createStoreSchema } from '../../../validation/store-validation-schema';
import { CFormTextarea, CFormFeedback, CFormInput } from '@coreui/react';
import "../../../scss/style.scss";

const StoreCreateEdit = () => {
  const { id } = useParams();
    //const {id}=23;

  const isEdit = !!id; // True if editing, false if creating

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(createStoreSchema),
    mode: 'onChange',
    context: { isEdit },
    defaultValues: {
      status: true,
    },
  });


  const onSubmit = async (payload) => {
    try {
      if (id && !payload.password) {
        delete payload.password;
      }

      const result = id ? await updateStoreData(id, payload) : await createNewStore(payload);
      if (result?.data?.status) {
        showToastr(result?.data?.message, 'success');
        navigate('/stores');
        reset(); // Reset the form after submission
      }
    } catch (error) {
      console.error('Error Response:', error?.response?.data.message);

      //  Ensure we extract the correct error message
      const errorMessage =
        error?.response?.data.message || 'Something went wrong. Please try again.';

      showToastr(errorMessage, 'error');
    }
  };

  // Fetch store data for editing
  useEffect(() => {
    if (id) {
      ; (async () => {
        try {
          const result = await getStoreData(id);
          if (result?.data?.status) {
            const { store_name, store_owner, location, mobile, status, min_spend_amount} =
              result.data.data;
            setValue('store_name', store_name);
            setValue('store_owner', store_owner);
            setValue('location', location);
            setValue('mobile', mobile);
            setValue('min_spend_amount', min_spend_amount);
            setValue('status', status);
          }
        } catch (error) {
          showToastr('Failed to load store data.', 'error');
        }
      })();
    }
  }, [id, setValue]);

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className={'font-weight-bold h5'}>
            {id
              ? StorePagetitleConstants.STORE_EDIT_TITLE
              : StorePagetitleConstants.STORE_ADD_TITLE}
            <div className="card-header-actions">
              <Link to="/stores">
                <CustomButton
                  color="danger"
                  className="btn-sm"
                  labelClass={'ml-2'}
                  text="Back"
                  icon={<FaArrowLeftLong className="mb-1" />}
                />
              </Link>
            </div>
          </CCardHeader>

          <CForm onSubmit={handleSubmit(onSubmit)} className="admin-add">
            <CCardBody>
              <CInputGroup className="row">
                <div className="mb-3 col-sm-4">
                  <FormInput
                    {...register('store_name')}
                    placeholder="Enter store name"
                    error={errors?.store_name?.message}
                    readonly={isSubmitting}
                    label={'Store name'}
                    autocomplete="off"
                  />
                </div>
                <div className="mb-1 col-sm-4">
                  <FormInput
                    {...register('store_owner')}
                    placeholder="Enter owner name"
                    error={errors?.store_owner?.message}
                    readonly={isSubmitting}
                    label={'Owner name'}
                    autocomplete="off"
                  />
                </div>
                <div className="mb-1 col-sm-4">
                  <CFormLabel htmlFor="location">Location</CFormLabel>
                  <CFormTextarea
                    id="location"
                    {...register('location')}
                    placeholder="Enter location"
                    readonly={isSubmitting}
                    invalid={!!errors.location} // CoreUI's `invalid` prop to style error state
                    autocomplete="off"
                  />
                  {errors.location && (
                    <CFormFeedback invalid>{errors.location.message}</CFormFeedback>
                  )}
                </div>
              </CInputGroup>
              <CInputGroup className="row">
                <div className="mb-1 col-sm-4">
                  <CFormLabel htmlFor="mobile">Mobile no</CFormLabel>
                  <CFormInput
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    {...register('mobile')}
                    placeholder="Enter mobile no"
                    readonly={isSubmitting}
                    invalid={!!errors.mobile}
                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))} // Removes non-numeric input
                    autocomplete="off"
                  />
                  {errors.mobile && <CFormFeedback invalid>{errors.mobile.message}</CFormFeedback>}
                </div>
                <div className="mb-1 col-sm-4">
                  <CFormLabel htmlFor="mobile">Min spend amount</CFormLabel>
                  <CFormInput
                    id="min_spend_amount"
                    type="number"
                    inputMode="numeric"
                    {...register('min_spend_amount')}
                    placeholder="Enter min spend amount"
                    readonly={isSubmitting}
                    invalid={!!errors.min_spend_amount}
                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))} // Removes non-numeric input
                    autocomplete="off"
                  />
                  {errors.min_spend_amount && <CFormFeedback invalid>{errors.min_spend_amount.message}</CFormFeedback>}
                </div>
              </CInputGroup>
              
              <CInputGroup className="row">
                <div className="mb-1 col-sm-4">
                  <CFormLabel htmlFor="select" className="col-form-label">
                    Status
                  </CFormLabel>
                  <CFormSwitch
                    name="status"
                    className="mr-1"
                    color="primary"
                    {...register('status')}
                  />
                </div>
              </CInputGroup>
            </CCardBody>
            <CCardFooter>
              <CustomButton
                className="mt-1 btn-sm mr-2 "
                color="primary"
                disabled={isSubmitting}
                type="submit"
                text={
                  isSubmitting
                    ? StorePagetitleConstants.BUTTON_SUBMITTING_TITLE
                    : StorePagetitleConstants.BUTTON_SUBMIT_TITLE
                }
                icon={<FaSave className="mb-1 mr-1" size={'16px'} />}
              />
              <Link aria-current="page" to="/stores">
                <CustomButton
                  color="danger"
                  className="mt-1 btn-sm"
                  text="Cancel"
                  disabled={isSubmitting}

                  icon={<IoClose className="mb-1 mr-1" size={'16px'} />}
                />
              </Link>
            </CCardFooter>
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default StoreCreateEdit;
