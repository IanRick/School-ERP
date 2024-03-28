import React, { useContext, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Cookies from 'js-cookie';
import { sessionContext } from './SessionContext';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Signin = () => {

    const {session, setSession} = useContext(sessionContext);
    const [feedback, setFeedback] = useState(true);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        pswd: "",
    });

    const handleChange= (event) => {
        setSession('session', null);
        const {name, value} = event.target;
        setFormData({...formData, [name]: value})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setFeedback(false);
        console.log(formData);

        axios
            .post('http://127.0.0.1/api/Signin.php', formData)
            .then((response) => {
                console.log(response.data);
                setFeedback(true);
                Cookies.set('session', response.data)
                setSession(Cookies.get('session'));
                if (response.data === '') {
                    return '';
                } else {
                    navigate('/');
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Kenyatta Barracks pri sch</h1>
                <br />
    		    <h2>Sign In</h2>
                <br />
                <label htmlFor="Username">Username</label>
                <input type="text" name="username" required onChange={handleChange} />
                <br />
                <label htmlFor="Password">Password</label>
                <input type="password" name="pswd" required onChange={handleChange} />
                {session === '' ? <p>Wrong Username or Password!</p> : ''}
                <NavLink to="/signup">Sign up?</NavLink>
                <button type="submit" className="btn">Submit</button>
            </form>

            {
                feedback ? '' : <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open>
                <CircularProgress color="inherit" />
              </Backdrop>
            }
        </div>
    );
}
 
export default Signin;