import authReducer from '../reducers/authReducer'
import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import thunk from 'redux-thunk'

const reducer = combineReducers({ auth: authReducer })

const store = createStore(
  reducer,
  compose(applyMiddleware(...[thunk]))
)

export default store
