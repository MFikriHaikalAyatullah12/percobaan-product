import React from 'react';
import Dashboard from '../components/dashboard/Dashboard';
import StatCards from '../components/dashboard/StatCards';
import GradeChart from '../components/dashboard/GradeChart';

const DashboardPage = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <StatCards />
            <GradeChart />
            <Dashboard />
        </div>
    );
};

export default DashboardPage;