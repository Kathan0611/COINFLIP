import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'

export const statusHeader = (fields, data) => {
  return (
    <span className="sortCls">
      <span className="table-header-text-mrg">Status</span>
      {fields.sort_field !== 'status' && data?.length > 0 && <FaSort />}
      {fields.sort_dir.toLowerCase() === 'asc' &&
        fields.sort_field === 'status' &&
        data?.length > 0 && <FaSortUp />}
      {fields.sort_dir.toLowerCase() === 'desc' &&
        fields.sort_field === 'status' &&
        data?.length > 0 && <FaSortDown />}
    </span>
  )
}
