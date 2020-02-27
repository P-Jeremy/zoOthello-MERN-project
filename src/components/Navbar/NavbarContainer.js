import { connect } from 'react-redux'
import NavbarOthello from './Navbar'
import { logOut } from '../../actions/authActions'

const mapStateToProps = ({ auth }) => ({
  auth
})

const mapDispatchToProps = (dispatch) => ({
  logOut: () => {
    dispatch(logOut())
  }
})

const NavbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavbarOthello)

export default NavbarContainer
