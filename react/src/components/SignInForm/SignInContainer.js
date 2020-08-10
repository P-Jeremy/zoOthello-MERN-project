import { connect } from 'react-redux'
import { logIn } from '../../actions/authActions'
import SignInForm from './SignInForm'

const mapStateToProps = ({ auth }) => ({
  auth
})

const mapDispatchToProps = (dispatch) => ({
  logIn: (user) => {
    dispatch(logIn(user))
  }
})

const SignInContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInForm)

export default SignInContainer
