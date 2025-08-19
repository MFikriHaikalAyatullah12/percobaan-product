import React from 'react';

const StatCards = () => {
    const stats = [
        { title: 'Total Students', value: 120 },
        { title: 'Total Teachers', value: 15 },
        { title: 'Total Classes', value: 10 },
        { title: 'Total Grades', value: 300 }
    ];

    return (
        <div className="stat-cards">
            {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                    <h3>{stat.title}</h3>
                    <p>{stat.value}</p>
                </div>
            ))}
        </div>
    );
};

export default StatCards;