import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const Signup = () => {

    const navigate = useNavigate();

    //set initial state for the form data
    const [formData, setFormData] = useState({
        username: "",
        pswd: "",
        repeatPassword: "",
    });

    //Handle form data changes
    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value})
    };

    //Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        //Make HTTP POST request to PHP script
        axios
            .post('http://127.0.0.1/api/Signup.php', formData)
            .then((response) => {
                console.log(response.data);
                if (response.data === 'Done') {
                    return navigate('/signin');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Kenyatta Barracks pri sch</h1>
                <br />
                <h2>Sign Up</h2>
                <br />
                <label htmlFor="username">Username</label>
                <br />
                <input type="text" name="username" required onChange={handleChange} />
                <br />
                <label htmlFor="pswd">New Password</label>
                <br />
                <input type="text" name="pswd" required onChange={handleChange} />
                <br />
                <label htmlFor="repeatPassword">Repeat Password</label>
                <br />
                <input type="text" name="repeatPassword" required onChange={handleChange} />
                <br />
                <NavLink to="/signin">Sign In?</NavLink>
                <button type="SignUp" className="btn">Submit</button>
            </form>
        </div>
    );
}
 
export default Signup;