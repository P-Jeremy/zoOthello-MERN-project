import axios from 'axios'
import { toast } from 'react-toastify'

const uri = `${process.env.URI}/api/user`

export const CHECK_AUTH = 'CHECK_AUTH'
export const checkAuth = () => {
  return function (dispatch) {
    const payload = JSON.parse(localStorage.getItem('loggedIn'))
    dispatch({ type: CHECK_AUTH, payload })
  }
}

export const LOG_IN = 'LOG_IN'
export const logIn = (user) => {
  return async function (dispatch) {
    let payload = false
    try {
      const result = await axios.post(`${uri}/signIn`, user)
      if (result.status === 200) {
        payload = true
        localStorage.setItem('userId', result.data.fetchedUser.id)
        localStorage.setItem('loggedIn', true)
      }
    } catch (err) {
      if (err.response.status === 404) {
        toast.error('Verifiez vos identifiants')
      }
    }
    dispatch({ type: LOG_IN, payload })
  }
}

export const LOG_OUT = 'LOG_OUT'
export const logOut = () => {
  return function (dispatch) {
    const payload = false
    localStorage.clear()
    dispatch({ type: LOG_OUT, payload })
  }
}
