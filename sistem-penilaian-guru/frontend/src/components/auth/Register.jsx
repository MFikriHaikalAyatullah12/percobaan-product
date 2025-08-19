import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { registerUser } from '../../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const history = useHistory();

    const { username, email, password, confirmPassword } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await registerUser({ username, email, password });
            history.push('/login');
        } catch (err) {
            setError(err.response.data.message || 'Registration failed');
        }
    };

    return (
        <div className="register">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleChange} required />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;