import axios from 'axios'

const uri = 'http://localhost:3000/api/user'

export const LOG_IN = 'LOG_IN'
export const logIn = (user) => {
  return async function (dispatch) {
    const res = await axios.post(`${uri}/signIn`, user)
    let payload = false
    if (res.status === 200) {
      payload = true
      localStorage.setItem('userId', res.data.fetchedUser._id)
      localStorage.setItem('loggedIn', true)
    }
    dispatch({ type: LOG_IN, payload })
  }
}

// export const LOG_OUT = 'LOG_OUT'
// export const logOut = () => {
//   return async function (dispatch) {
//     const response = await axios.get('http://localhost:8080/api/list')
//     dispatch({ type: LOG_OUT, payload: response.data })
//   }
// }
