import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import GradesPage from './pages/GradesPage';
import ReportsPage from './pages/ReportsPage';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Header />
                <Sidebar />
                <main>
                    <React.Suspense fallback={<LoadingSpinner />}>
                        <Switch>
                            <Route path="/" exact component={DashboardPage} />
                            <Route path="/login" component={LoginPage} />
                            <Route path="/students" component={StudentsPage} />
                            <Route path="/grades" component={GradesPage} />
                            <Route path="/reports" component={ReportsPage} />
                        </Switch>
                    </React.Suspense>
                </main>
            </div>
        </Router>
    );
};

export default App;