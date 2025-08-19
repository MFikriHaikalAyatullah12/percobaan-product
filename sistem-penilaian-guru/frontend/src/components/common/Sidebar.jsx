import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Navigation</h2>
            <ul>
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/students">Students</Link>
                </li>
                <li>
                    <Link to="/grades">Grades</Link>
                </li>
                <li>
                    <Link to="/reports">Reports</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;