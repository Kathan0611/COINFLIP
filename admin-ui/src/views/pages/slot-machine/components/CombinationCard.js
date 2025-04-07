import React from 'react'
import PropTypes from 'prop-types'
import { FaTrash, FaMinus } from 'react-icons/fa'
import CustomButton from '../../../../components/Button'
import FormInput from '../../../../components/FormInput'
import { CRow } from '@coreui/react'
import '../scss/styles.scss'

export const CombinationCard = ({
  combinationIndex,
  field,
  register,
  errors,
  watch,
  removePrizeField,
  handleDeleteCombination, // may be undefined if no delete permission
}) => {
  return (
    <div key={field.id} className="border rounded p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Combination {combinationIndex + 1}</h6>
        {/* Render delete button only if handleDeleteCombination exists */}
        {handleDeleteCombination && (
          <CustomButton
            color="danger"
            className="btn-sm"
            type="button"
            text=""
            icon={<FaTrash />}
            onClick={() => handleDeleteCombination(combinationIndex)}
          />
        )}
      </div>
      <CRow>
        <div className="col-sm-4">
          <FormInput
            type="number"
            placeholder="e.g., 123, 345"
            label="Combination"
            {...register(`combinations.${combinationIndex}.combination`)}
            error={errors.combinations?.[combinationIndex]?.combination?.message}
          />
        </div>
        <div className="col-sm-8">
          {watch(`combinations.${combinationIndex}.prizes`)?.map((prize, prizeIndex) => (
            <div key={prizeIndex} className="d-flex gap-2 mb-2">
              <FormInput
                type="text"
                placeholder="Enter prize name"
                label={prizeIndex === 0 ? 'Prize' : ''}
                {...register(`combinations.${combinationIndex}.prizes.${prizeIndex}.name`)}
                error={errors.combinations?.[combinationIndex]?.prizes?.[prizeIndex]?.name?.message}
              />
              <FormInput
                type="number"
                placeholder="Enter prize limit"
                label={prizeIndex === 0 ? 'Prize Limit' : ''}
                {...register(`combinations.${combinationIndex}.prizes.${prizeIndex}.prize_limit`)}
                error={
                  errors.combinations?.[combinationIndex]?.prizes?.[prizeIndex]?.prize_limit
                    ?.message
                }
                min="0"
              />
              {watch(`combinations.${combinationIndex}.prizes`)?.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm align-self-end mb-2"
                  onClick={() => removePrizeField(combinationIndex, prizeIndex)}
                >
                  <FaMinus />
                </button>
              )}
            </div>
          ))}
        </div>
      </CRow>
    </div>
  )
}

CombinationCard.propTypes = {
  combinationIndex: PropTypes.number.isRequired,
  field: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  removePrizeField: PropTypes.func.isRequired,
  handleDeleteCombination: PropTypes.func, // Not required so delete button is hidden when undefined
}

export default CombinationCard
