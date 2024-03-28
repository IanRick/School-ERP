import React, {useEffect, useState} from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Navbar from "./Navbar";
import axios from "axios";
import AddStudentCSS from './AddStudent.module.css';
import Cookies from "js-cookie";
import avatar from "./images/avatar.png";
import { storage } from "./firebase";
import { ref, getDownloadURL} from "firebase/storage";
import { useNavigate } from "react-router-dom";

//alert function
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const TransferStudent = () => {

    //use state declarations
    const[showStudent, setShowStudent] = useState();
    const[showPayment, setShowPayment] = useState();
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [openDeletion, setOpenDeletion] = React.useState(false);
    const [feedback, setFeedback] = useState(true);
    const [success, setSuccess] = useState(false);
    const studentId = {id: Cookies.get('id')};
    const [imgUrl, setImgUrl] = useState();
    const [imageName, setImageName] = useState();
    const [previewImage, setPreviewImage] = useState();
    const [imgFile, setImgFile] = useState(null);
    const [studentName, setStudentName] = useState();
    const [deletionSuccess, setDeletionSuccess] = useState(true);
    const navigate = useNavigate();

    //close alert function
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
        setOpen2(false);
        setOpenDeletion(false);
    };

    const gotoAllStudents2 = () => {
        setTimeout(function() {
            alert("Student deleted successfully!");
            navigate("/alltransferedstudents");
            setFeedback(true);
        });
    }

    //function to handle the display of tansfer student popup window
    const handleDeleteStudent = () => {
        let deleteStudent = window.confirm("Are you sure you want to delete " + studentName.toLowerCase() + "?");

        if (deleteStudent === true) {
            let deletionData = studentId;

            axios
                .post('http://127.0.0.1/api/deleteTransferedStudent.php', deletionData)
                .then((response) => {
                    console.log(response.data);
                    if (response.data === "Done") {
                        gotoAllStudents2();
                    } else if (response.data === "Failed") {
                        setDeletionSuccess(false);
                        setOpenDeletion(true);
                        setFeedback(true);
                    } else {
                        setDeletionSuccess(false);
                        setOpenDeletion(true);
                        setFeedback(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        } else {
            return;
        }
    }


    //function to fetch and display all student info
    let data;

    useEffect(() => {

        axios
            .post('http://127.0.0.1/api/transferedStudent.php', JSON.stringify(studentId))
            .then((response) => {
                if (response.data === "Failed") {
                    setSuccess(false);
                    setFeedback(true);
                    setOpen(true);
                } else {
                    data = response.data.map(function (row) {
                        setImageName(row.imageName);
                        setStudentName(row.studentname);

                        //function to display student image from firebase
                        const getImageUrl = async () => {
                            if (imageName) {
                                try {
                                    const imgRef = await ref(storage, `studentImages/${imageName}`);
                                    const url = await getDownloadURL(imgRef);
                                    setImgUrl(url);
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                        };
                
                        getImageUrl();

                        return (
                            <div style={{background: "beige"}} key={row.id}>
                                <h1 className="head">{row.studentname}</h1>
                                <div className="imageCont">
                                    <div className="image">
                                        <img src={imgUrl ? imgUrl : avatar} alt="Student"/>
                                    </div>
                                    <div className="buttons">
                                        <button onClick={handleDeleteStudent}>Delete Student</button>
                                    </div>
                                </div>
                                <div className="studentCont">
                                    <div className="infoCont">
                                        <h4>Student Info</h4>
                                        <p><b>NAME:</b> {row.studentname}</p>
                                        <p><b>GRADE:</b> {row.grade}</p>
                                        <p><b>GENDER:</b> {row.gender}</p>
                                        <p><b>ADMS NO.:</b> {row.admsno}</p>
                                        <p><b>D.O.B:</b> {row.dob}</p>
                                        <p><b>BIRTH CERT:</b> {row.bcn}</p>
                                        <p><b>REMARKS:</b></p>
                                        <textarea value={row.remarks} readOnly></textarea>
                                    </div>
                                    <div className="infoCont">
                                        <h4>Parents Info</h4>
                                        <p><b>FATHER:</b> {row.fathername}</p>
                                        <p><b>FATHER'S NO:</b> {row.fathernumber}</p>
                                        <p><b>FATHER'S ID:</b> {row.fatherid}</p>
                                        <br />
                                        <p><b>MOTHER:</b> {row.mothername}</p>
                                        <p><b>MOTHER'S NO:</b> {row.mothernumber}</p>
                                        <p><b>MOTHER'S ID:</b> {row.motherid}</p>
                                    </div>
                                    <div className="infoCont">
                                        <h4>Admission Info</h4>
                                        <p><b>ADMS GRADE:</b> {row.admissiongrade}</p>
                                        <p><b>ADMS DATE:</b> {row.admissiondate}</p>
                                        <br />
                                        <p><b>TRANSFERED TO:</b> {row.transferto}</p>
                                        <p><b>TRANSFER DATE:</b> {row.transferdate}</p>
                                        <p><b>TRANSFER REASON:</b> {row.transferreason}</p>
                                        <p><b>BALANCE:</b> {row.balance}</p>
                                        
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    setShowStudent(data);
                    setFeedback(true);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    })


    const [formData, setFormData] = useState({
        amount: "", 
        payDate: "",
        term: "",
        dsc: "",
        id: Cookies.get('id')
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value.toUpperCase()})
        console.log(formData);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setFeedback(false);

        //Make HTTP POST request to PHP script
        axios
            .post('http://127.0.0.1/api/AddPayment.php', formData)
            .then((response) => {
                console.log(response.data);
                if (response.data === "Done") {
                    setSuccess(true);
                    setOpen(true);
                    setFeedback(true);
                } else if (response.data == null) {
                    setSuccess(false);
                    setOpen(true);
                    setFeedback(false);
                } else {
                    setSuccess(false);
                    setOpen(true);
                    setFeedback(true);
                }
            })
            .catch((error) => {
                console.log(error);
                setSuccess(false);
                setOpen(true);
                setFeedback(true);
            });
    };


    useEffect(() => {
        axios
            .post('http://127.0.0.1/api/Payments.php', JSON.stringify(studentId))
            .then((response) => {
                if (response.data === "Failed" || response.data == null) {
                    setSuccess(true);
                    setFeedback(true);
                    setOpen(true);
                } else {
                    data = response.data.map(function (row) {
                        return (
                            <tr key={row.paymentid}>
                                <td>{row.paymentid}</td>
                                <td>{row.amount}</td>
                                <td>{row.payDate}</td>
                                <td>{row.term}</td>
                                <td>{row.dsc}</td>
                            </tr>
                        )
                    })
                    setShowPayment(data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    })


    return (
        <div>
            <Navbar />

            {
                showStudent ? showStudent : <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open>
                    <CircularProgress color="inherit" />
                </Backdrop>
            }

            <div className="student">
                <span className="head" style={{width: "75%", margin: "auto"}}>PAYMENT INFO</span>
                <div className="paymentCont">
                    <div className="paymentData">
                    <table>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <th>AMOUNT</th>
                                <th>DATE</th>
                                <th>TERM</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            {
                                showPayment ? showPayment : <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open>
                                <CircularProgress color="inherit" />
                            </Backdrop>
                            }
                        </tbody>
                    </table>
                    </div>
                    <div id="addPayment" className={AddStudentCSS.form2}>
                        <form onSubmit={handleSubmit}>
                            <h1>Add New Payment</h1><br />
                            <label htmlFor="amount">Amount</label>
                            <input type="text" name="amount" required onChange={handleChange} />
                            <label htmlFor="payDate">Date of Payment</label>
                            <input type="date" name="payDate" required onChange={handleChange} />
                            <label htmlFor="term">Term</label>
                            <select type="text" id="term" name="term" required onFocus={handleChange} onChange={handleChange}>
                                <option value="TERM ONE">TERM ONE</option>
                                <option value="TERM TWO">TERM TWO</option>
                                <option value="TERM THREE">TERM THREE</option>
                            </select>
                            <label htmlFor="dsc">Description</label>
                            <input type="text" name="dsc" defaultValue="N/A" required placeholder="Brief Description of Payment(optional)" onChange={handleChange} />
                            <button className="btn">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            {success ? <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                  New Payment added successfully!
                </Alert>
              </Snackbar> : <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  Database connection failed! Please contact your Service Provider.
                </Alert>
              </Snackbar>}

              {deletionSuccess ? "" : <Snackbar open={openDeletion} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  Student deletion not successfull!
                </Alert>
              </Snackbar>}
            
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
 
export default TransferStudent;