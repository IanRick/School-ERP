import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <header>
            <nav className="navbar">
                <h1>Kenyatta Barracks Pri School</h1>
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/deletedfees">Deleted Fees</NavLink>
                <NavLink to="/allfees">All Fees</NavLink>
                <NavLink to="/alltransferedstudents">Transfered students</NavLink>
                <NavLink to="/allstudents">All Students</NavLink>
                <NavLink to="/addstudent">Add Student</NavLink>
                <NavLink to="/">Home</NavLink>
            </nav>
        </header>
    );
}
 
export default Navbar;