import { connect } from 'react-redux'
import { checkAuth } from './actions/authActions'
import App from './app'

const mapStateToProps = ({ auth }) => ({
  auth
})

const mapDispatchToProps = (dispatch) => ({
  checkAuth: () => {
    dispatch(checkAuth())
  }
})

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer
