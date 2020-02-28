import { LOG_IN, CHECK_AUTH, LOG_OUT } from '../actions/authActions'

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
    case LOG_OUT: {
      const isUserAuth = action.payload
      return isUserAuth
    }
    default:
      return state
  }
};
