import { connect } from 'react-redux'
import NavbarOthello from './Navbar'

const mapStateToProps = ({ auth }) => ({
  auth
})

const NavbarContainer = connect(
  mapStateToProps
)(NavbarOthello)

export default NavbarContainer
