import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const Navigation = () => {
    return (
        <Navbar bg="light" fixed='top'>
            <Navbar.Brand className="mr-auto"><Link to="/">COVID INSIGHTS</Link></Navbar.Brand>
            <Nav>
                <Nav.Link><Link to="/">Map</Link></Nav.Link>
                <Nav.Link><Link to="/about">About</Link></Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default Navigation;