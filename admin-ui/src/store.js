import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  user: null,
}

const changeState = (state = initialState, action) => {
  const { type, ...rest } = action
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'SET_USER':
      return { ...state, user: rest.user }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
