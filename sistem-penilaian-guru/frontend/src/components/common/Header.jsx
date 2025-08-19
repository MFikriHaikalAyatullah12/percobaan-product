import React from 'react';

const Header = () => {
    return (
        <header>
            <h1>Sistem Penilaian Guru</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/students">Students</a></li>
                    <li><a href="/grades">Grades</a></li>
                    <li><a href="/reports">Reports</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;