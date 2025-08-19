import React from 'react';
import StatCards from './StatCards';
import GradeChart from './GradeChart';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <StatCards />
            <GradeChart />
        </div>
    );
};

export default Dashboard;