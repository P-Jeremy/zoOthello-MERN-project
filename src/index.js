import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './appContainer'
import { Provider } from 'react-redux'
import store from './store/store'

const Root = (
  <>
    <Provider store = {store}>
      <AppContainer/>
    </Provider>
  </>
)

ReactDOM.render(Root, document.getElementById('root'))
