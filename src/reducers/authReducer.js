import { LOG_IN, CHECK_AUTH } from '../actions/authActions'

export default function authReducer (state = false, action) {
  switch (action.type) {
    case CHECK_AUTH: {
      const isUserAuth = action.payload
      return isUserAuth
    }
    case LOG_IN: {
      const isUserAuth = action.payload
      return isUserAuth
    }
    // case LISTS_GET: {
    //   const list = [state, ...action.payload]
    //   return list
    // }
    default:
      return state
  }
};
