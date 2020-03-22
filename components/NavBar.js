import { Navbar, NavDropdown, NavItem, Nav, Image } from 'react-bootstrap';
import logo from '../public/logo.jpg';

export default function Header() {
	return (
		<Navbar bg="dark" variant="dark">
			<Image alt="" src={require('../public/logo.jpg')} height='30' width='30' className="d-inline-block align-top" roundedCircle />
			<Navbar.Brand href="#home">JOY</Navbar.Brand>
			<Nav className="mr-auto">
				<Nav.Link href="#home">Home</Nav.Link>
				<Nav.Link href="#features">Features</Nav.Link>
				<Nav.Link href="#pricing">Pricing</Nav.Link>
			</Nav>
			<Nav style={{alignItems:'center'}} className="align-middle">
				<NavItem style={{color:'white'}} eventKey={1} href='#'><i className="fa fa-envelope fa-fw"></i></NavItem>
				<NavDropdown style={{allignSelf:'center'}} classNaem="nav pull-right" bg="light" title="">
					<NavDropdown.Item href="#action/3.1"><i className="fa fa-envelope fa-fw"></i>LogIn As User</NavDropdown.Item>
					<NavDropdown.Item href="#action/3.2"><i className="fa fa-envelope fa-fw"></i>LogIn As Seller</NavDropdown.Item>
					<NavDropdown.Item href="#action/3.3"><i className="fa fa-gear fa-fw"></i> Settings</NavDropdown.Item>
					<NavDropdown.Divider />
					<NavDropdown.Item href="#action/3.4"><i className="fa fa-sign-out fa-fw"></i> Logout</NavDropdown.Item>
				</NavDropdown>
			</Nav>

		</Navbar>
	);
}