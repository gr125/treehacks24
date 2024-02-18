import React, { useState } from 'react';
import axios from 'axios';
import './login.css'
import email_icon from './assets/email.png'
import password_icon from './assets/password.png'
import logo from './assets/logo.png'

const LoginPage = ({ handleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginClick = async () => {
        try {
            // Send login request to the server
            const response = await axios.post('http://localhost:3080/auth', { email, password });
            console.log(email, password)
            // If login is successful, call handleLogin function
            if (response.data.message === 'success') {
                handleLogin(response.data.userId);
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container">
          <header className="nav"></header>
          <div className='verticalbox'>
            <div className='grid-container'>
            <div className='loginheader'>MedEasy</div>
            <div className='logo'><img src={logo} alt='' /></div>
            </div>
            <div className='underline'></div>
          <div className='inputs'>
            <div className='input'>
          <img src={email_icon} alt='' />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </div>
          <div className='input'>
          <img src={password_icon} alt='' />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>
          </div>
          <button onClick={handleLoginClick}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <footer class="footer"></footer>
          </div>
        </div>

        // <div className="container"> {/* Apply class name from CSS */}
        //     <h2>Login</h2>
        //     <div className="inputContainer"> {/* Apply class name from CSS */}
        //         <label className="label">Email:</label> {/* Apply class name from CSS */}
        //         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" /> {/* Apply class name from CSS */}
        //     </div>
        //     <div className="inputContainer"> {/* Apply class name from CSS */}
        //         <label className="label">Password:</label> {/* Apply class name from CSS */}
        //         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" /> {/* Apply class name from CSS */}
        //     </div>
        //     <button onClick={handleLoginClick} className="button">Login</button> {/* Apply class name from CSS */}
        //     {error && <p className="error">{error}</p>} {/* Apply class name from CSS */}
        // </div>
    );
};

export default LoginPage;