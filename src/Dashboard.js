import { useState,useEffect } from "react";

const Dashboard = () => {

    const [showPost, setShowPost] = useState()
    const apiURL = "http://127.0.0.1/api/DashboardData.php";

    let displayData

    function pullJson() {
        fetch(apiURL)
        .then(response => response.json())
        .then(responseData => {
            displayData = responseData.map(function(todo) {
                return(
                    <tr key={todo.Id}>
                        <td>{todo.Id}</td>
                        <td>{todo.Firstname}</td>
                        <td>{todo.Grade}</td>
                        <td>{todo.Paid}</td>
                        <td>1000</td>
                        <td>2</td>
                    </tr>
                )
            })

            setShowPost(displayData);
            console.log(responseData);
        })
    }

    useEffect(() => {
        pullJson()
    }, [])


    return (
        <div className="balances">
            <h2>Student Fee Payments and Balances</h2>

            <table>
                <tbody>
                    <tr>
                        <td>ID</td>
                        <td>NAME</td>
                        <td>GRADE</td>
                        <td>PAID</td>
                        <td>BALANCE</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
 
export default Dashboard;