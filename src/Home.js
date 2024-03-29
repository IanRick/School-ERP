import React, { useContext } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from "react";
import Navbar from './Navbar';
import { sessionContext } from './SessionContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Home = () => {
    useEffect(() => {
        if (session === '' || session == null) {
            return navigate('/signin');
        }
    })

    const {session} = useContext(sessionContext);
    const navigate = useNavigate();

    const url = "iano.kesug.com/DashboardData.php";

    const [search, setSearch] = useState('');
    const [showData, setShowData] = useState();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        getData();
    })

    let data;

    function getData() {
        fetch(url)
        .then(response => response.json())
        .then(responseData => {
            data = responseData.filter((item) => {
                if (search.toLowerCase() === '') {
                    return item;
                } else if (item.studentname.toLowerCase().includes(search.toLowerCase()) || item.studentid.includes(search)) {
                    return item;
                } else {
                    return '';
                }
            }).map(function (row) {
                return (
                    <tr key={row.balanceid}>
                        <td>{row.balanceid}</td>
                        <td>{row.studentname}</td>
                        <td>{row.grade}</td>
                        <td>{row.paid}</td>
                        <td>{row.balance}</td>
                        <td>{row.studentid}</td>
                    </tr>
                )
            })
            setShowData(data);
        })
    }

    const createBalances = () => {
        setIsLoading(true);
        axios
            .post('http://127.0.0.1/api/createBalances.php')
            .then((response) => {
                console.log(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className="balances">
            <Navbar />

            <h2>Student Fee Payments</h2>

            <div className="search">
                <button className='btn' onClick={createBalances} style={{display: 'none'}}>Add Balances</button>
                <input type="text" id="myInput" onChange={(e) => setSearch(e.target.value)} placeholder="Search record..." />
            </div>

            <table>
                <tbody>
                    <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Grade</th>
                    <th>Paid</th> 
                    <th>Balance</th>
                    <th>StudentId</th>
                    </tr>
                    {
                        showData ? showData : <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open>
                        <CircularProgress color="inherit" />
                      </Backdrop>
                    }

                    {
                        isLoading ? <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open>
                        <CircularProgress color="inherit" />
                      </Backdrop> : ''
                    }
                </tbody>
            </table>
        </div>
    );
}
 
export default Home;