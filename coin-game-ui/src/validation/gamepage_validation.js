import * as yup from 'yup'


//validation schema of game
export const gameValidationSchema=yup.object().shape({
   user_name:yup.string().trim() 
   .matches(/^[A-Za-z ]+$/, "Name must only contain letters").required('Name is required')
   .min(3, 'Name must be at least 3 characters long')
   .max(25, 'Name must not exceed 10 characters'),
   mobile_number:yup.string().trim() 
   .required('Mobile number is required')
   .max(10, 'Mobile number must not exceed 10 characters')
   .matches(/^[6-9][0-9]{9}$/,"Mobile number must start with 6-9 and contain must be 10 digits")
   ,
   prediction_value:yup.string().
   oneOf(["head", "tail"], "Prediction must be head or tail").required('Prediction is required')
})