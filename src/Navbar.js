import React from 'react';
import { Button, Nav, Navbar, NavItem, MenuItem, NavDropdown} from 'react-bootstrap'
// import Navbar from 'react-bootstrap/lib/Navbar';

export default class myNav extends React.Component {
    render() {
      return (
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Ethos Crowd Funding</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="#">
                Link
              </NavItem>
              <NavItem eventKey={2} href="#">
                Link
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
}
