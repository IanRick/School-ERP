import React, { useContext } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from "react";
import Navbar from './Navbar';
import { sessionContext } from './SessionContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const AllStudents = () => {

    const {session} = useContext(sessionContext);

    useEffect(() => {
        if (session === '' || session == null) {
            return navigate('/signin');
        }
    })

    const navigate = useNavigate();

    const url = "http://127.0.0.1/api/allTransferedStudents.php";

    const [search, setSearch] = useState('');
    const [showData, setShowData] = useState();


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
                } else if (item.studentname.toLowerCase().includes(search) || item.fathername.toLowerCase().includes(search) || item.mothername.toLowerCase().includes(search)) {
                    return item;
                } else {
                    return null;
                }
            }).map(function (row) {
                return (
                    <tr key={row.transferedstudentid} onClick={() => handleClick(row)}>
                        <td>{row.transferedstudentid}</td>
                        <td>{row.studentname}</td>
                        <td>{row.grade}</td>
                        <td>{row.balance}</td>
                        <td>{row.transferto}</td>
                        <td>{row.fathername}</td>
                        <td>{row.mothername}</td>
                    </tr>
                )
            })
            setShowData(data);
        })
    }

    const handleClick = (row) => {
        Cookies.set('id', row.transferedstudentid);
        console.log(Cookies.get('id'));
        navigate('/transferedstudent');
    }

    return (
        <div className="balances">
            <Navbar />

            <h2>All Transfered Students Records</h2>

            <div className="search">
                <input type="text" id="myInput" onChange={(e) => setSearch(e.target.value)} placeholder="Search record..." />
            </div>

            <table>
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>GRADE</th>
                        <th>BALANCE</th>
                        <th>TRANSFERED TO</th>
                        <th>FATHER</th>
                        <th>MOTHER</th>
                    </tr>
                    {showData ? showData : <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open>
        <CircularProgress color="inherit" />
      </Backdrop>}
                </tbody>
            </table>
        </div>
    );
}
 
export default AllStudents;