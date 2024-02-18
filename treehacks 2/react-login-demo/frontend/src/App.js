import React, { useState } from 'react';
import LoginPage from './login';
import DashboardPage from './dashboard';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');

    const handleLogin = (id) => {
        setUserId(id);
        setLoggedIn(true);
    };

    return (
        <div>
            {loggedIn ? (
                <DashboardPage id={userId} />
            ) : (
                <LoginPage handleLogin={handleLogin} />
            )}
        </div>
    );
};

export default App;
