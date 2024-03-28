import React from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sessionContext } from "./SessionContext";
import Navbar from "./Navbar";
import Cookies from "js-cookie";

const Profile = () => {
    useEffect(() => {
        checkSession();
    })

    const {session, setSession} = useContext(sessionContext);
    const navigate = useNavigate();

    function checkSession() {
        if (session === '' || session == null) {
            return navigate('/signin');
        }
    }

    const handleLogout = (event) => {
        event.preventDefault();

        Cookies.remove('session');
        setSession(null);

    }

    return (
        <div>
            <Navbar />
            <h1>Profile Page</h1>
            <h2>{session}</h2>
            <br />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
 
export default Profile;