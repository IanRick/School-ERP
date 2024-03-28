import React, {useEffect, useState} from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Navbar from "./Navbar";
import axios from "axios";
import AddStudentCSS from './AddStudent.module.css';
import EditStudentCSS from './EditStudent.module.css';
import Cookies from "js-cookie";
import avatar from "./images/avatar.png";
import { storage } from "./firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";

//alert function
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const Student = () => {

    //use state declarations
    const [showStudent, setShowStudent] = useState();
    const [showPayment, setShowPayment] = useState();
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [openBalance, setOpenBalance] = React.useState(false);
    const [openTransfer, setOpenTransfer] = React.useState(false);
    const [openPaymentData, setOpenPaymentData] = React.useState(false)
    const [feedback, setFeedback] = useState(true);
    const [success, setSuccess] = useState(false);
    const [dataFound, setDataFound] = useState(true);
    const [editSuccess, setEditSuccess] = useState(false);
    const [transferSuccess, setTransferSuccess] = useState(false);
    const [balancePresent, setBalancePresent] = useState(true);
    const [balanceSuccess, setBalanceSuccess] = useState(false);
    const [undoPayment, setUndoPayment] = useState(false);
    const [openUndoPayment, setOpenUndoPayment] = useState(false);
    const studentId = {id: Cookies.get('id')};
    const [showEdit, setShowEdit] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showAddBalance, setShowAddBalance] = useState(false);
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
        setOpenBalance(false);
        setOpenPaymentData(false)
        setOpenTransfer(false);
        setOpenUndoPayment(false);
    };

    //function to handle the display of edit student popup window
    const handleEditStudent = () => {
        if (showEdit === false) {
            setShowEdit(true);
        } else if (showEdit === true) {
            setShowEdit(false);
        }
    }

    //function to handle the display of tansfer student popup window
    const handleTransferStudent = () => {
        if (showTransfer === false) {
            setShowTransfer(true);
        } else if (showTransfer === true) {
            setShowTransfer(false);
        }
    }

    //function to handle the display of tansfer student popup window
    const handleAddBalance = () => {
        if (showAddBalance === false) {
            setShowAddBalance(true);
        } else if (showAddBalance === true) {
            setShowAddBalance(false);
        }
    }

    const gotoAllStudents2 = () => {
        setTimeout(function() {
            alert("Student deleted successfully!");
            navigate("/allstudents");
            setFeedback(true);
        });
    }

    //function to handle the display of tansfer student popup window
    const handleDeleteStudent = () => {
        let deleteStudent = window.confirm("Are you sure you want to delete " + studentName.toLowerCase() + "?");

        if (deleteStudent === true) {
            let deletionData = studentId;

            axios
                .post('http://127.0.0.1/api/deleteStudent.php', deletionData)
                .then((response) => {
                    console.log(response.data);
                    if (response.data === "Done") {
                        gotoAllStudents2();
                    } else if (response.data === "Failed") {
                        setDeletionSuccess(false);
                        setOpenTransfer(true);
                        setFeedback(true);
                    } else {
                        setDeletionSuccess(false);
                        setOpenTransfer(true);
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
            .post('http://127.0.0.1/api/Student.php', JSON.stringify(studentId))
            .then((response) => {
                if (response.data === "Failed") {
                    setSuccess(false);
                    setFeedback(true);
                    setOpen(true);
                } else if (response.data === "") {
                    console.log("No payment data returned!")
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
                                        <button onClick={handleAddBalance}>Add Balance</button>
                                        <button onClick={handleEditStudent}>Edit Student</button>
                                        <button onClick={handleTransferStudent}>Transfer Student</button>
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
                                        <p><b>REMARKS:</b></p>
                                        <textarea value={row.remarks} readOnly></textarea>
                                    </div>
                                </div><div className={EditStudentCSS.popup} style={{
                                    display: showAddBalance ? "block" : "none",
                                }}>
                                    <div className={EditStudentCSS.close} onClick={handleAddBalance}>&times;</div>
                                    <form onSubmit={addBalance}>
                                        <h1>ADD BALANCE</h1>
                                        <div className={EditStudentCSS.fieldsetCont}>
                                            <fieldset>
                                                <legend>Add Balance</legend>
                                                <label htmlFor="newbalance">Add New Balance</label><br />
                                                <input type="text" name="balance" required onChange={handleBalanceChange} /><br />
                                            </fieldset>
                                        </div>
                                        <button className="btn" style={{
                                            display: "block",
                                            margin: "auto",
                                            width: "100px"
                                        }} onClick={handleAddBalance}>Submit</button>
                                    </form>
                                </div>
                                <div className={EditStudentCSS.popup} style={{
                                    display: showTransfer ? "block" : "none",
                                }}>
                                    <div className={EditStudentCSS.close} onClick={handleTransferStudent}>&times;</div>
                                    <form onSubmit={transferStudent}>
                                        <h1>TRANSFER {row.studentname}</h1>
                                        <div className={EditStudentCSS.fieldsetCont}>
                                            <fieldset>
                                                <legend>Transfer Info</legend>
                                                <label htmlFor="transferto">Transfer To</label><br />
                                                <input type="text" name="transferto" required onChange={handleTransferChange} /><br />
                                                <label htmlFor="transferdate">Date of Transfer</label><br />
                                                <input type="date" name="transferdate" onChange={handleTransferChange} /><br />
                                                <label htmlFor="transferreason">Reason for Transfer</label><br />
                                                <input type="text" name="transferreason" onChange={handleTransferChange} /><br />
                                            </fieldset>
                                        </div>
                                        <button className="btn" style={{
                                            display: "block",
                                            margin: "auto",
                                            width: "100px"
                                        }}>Save Edit</button>
                                    </form>
                                </div>
                                <div className={EditStudentCSS.popup} style={{
                                        display: showEdit ? "block" : "none",
                                    }}>
                                    <div className={EditStudentCSS.close} onClick={handleEditStudent}>&times;</div>
                                    <form onSubmit={editStudent}>
                                        <h1>EDIT {row.studentname}</h1>
                                        <div className={EditStudentCSS.fieldsetCont}>
                                            <fieldset>
                                                <legend>Student Info</legend>
                                                <label htmlFor='studentname'>Name of student</label><br />
                                                <input type="text" name="studentname" defaultValue={row.studentname} required onChange={handleEditChange} /><br />
                                                <label htmlFor="admsno">Admission Number</label><br />
                                                <input type="text" name="admsno" defaultValue={row.admsno} onChange={handleEditChange} /><br />
                                                <label htmlFor='bcn'>Birth Certificate Number</label><br />
                                                <input type="text" name="bcn" defaultValue={row.bcn} onChange={handleEditChange} /><br />
                                                <label htmlFor='grade'>Grade</label><br />
                                                <select name="grade" required defaultValue={row.grade} onChange={handleEditChange}>
                                                    <option value='PG'>PG</option>
                                                    <option value="PP1">PP1</option>
                                                    <option value="PP2">PP2</option>
                                                    <option value="GRADE 1">GRADE 1</option>
                                                    <option value="GRADE 2">GRADE 2</option>
                                                    <option value="GRADE 3">GRADE 3</option>
                                                    <option value="GRADE 4">GRADE 4</option>
                                                    <option value="GRADE 5">GRADE 5</option>
                                                    <option value="GRADE 6">GRADE 6</option>
                                                    <option value="GRADE 7">GRADE 7</option>
                                                </select><br />
                                                <label htmlFor="gender">Gender</label><br />
                                                <select name="gender" required defaultValue={row.gender} onChange={handleEditChange}>
                                                    <option value="MALE">MALE</option>
                                                    <option value="FEMALE">FEMALE</option>
                                                </select><br />
                                                <label htmlFor="dob">Date of Birth</label><br />
                                                <input type="date" name="dob" defaultValue={row.dob} onChange={handleEditChange} /><br />
                                                <label htmlFor="admissiongrade">Grade admitted to:</label><br />
                                                <select name="admissiongrade" required defaultValue={row.admissiongrade} onChange={handleEditChange}>
                                                    <option value='PG'>PG</option>
                                                    <option value="PP1">PP1</option>
                                                    <option value="PP2">PP2</option>
                                                    <option value="GRADE 1">GRADE 1</option>
                                                    <option value="GRADE 2">GRADE 2</option>
                                                    <option value="GRADE 3">GRADE 3</option>
                                                    <option value="GRADE 4">GRADE 4</option>
                                                    <option value="GRADE 5">GRADE 5</option>
                                                    <option value="GRADE 6">GRADE 6</option>
                                                    <option value="GRADE 7">GRADE 7</option>
                                                </select><br />
                                                <label htmlFor="admissiondate">Date of Admission</label><br />
                                                <input type="date" name="admissiondate" defaultValue={row.bcn} onChange={handleEditChange} /><br />
                                                <label htmlFor="remarks">Remarks</label><br />
                                                <textarea name="remarks" style={{width: "90%"}} rows="10" defaultValue={row.remarks} onChange={handleEditChange}></textarea><br />
                                                <label htmlFor="imgFile">Student Image</label>
                                                <input type="file" accept=".png, .jpg, .jpeg" onChange={handleEditImgChange} />
                                                <img src={previewImage ? previewImage : avatar} alt="Student" height="100px" width="100px" />
                                            </fieldset>
                                            <fieldset>
                                                <legend>Parents info</legend>
                                                <label htmlFor="fathername">Father's Name</label><br />
                                                <input type="text" name="fathername" defaultValue={row.fathername} onChange={handleEditChange} /><br />
                                                <label htmlFor="fathernumber">Father's Number</label><br />
                                                <input type="text" name="fathernumber" defaultValue={row.fathernumber} onChange={handleEditChange} /><br />
                                                <label htmlFor="fatherid">Father's Id</label><br />
                                                <input type="text" name="fatherid" defaultValue={row.fatherid} onChange={handleEditChange} /><br />
                                                <label htmlFor="mothername">Mother's Name</label><br />
                                                <input type="text" name="mothername" defaultValue={row.mothername} onChange={handleEditChange} /><br />
                                                <label htmlFor="mothernumber">Mother's Number</label><br />
                                                <input type="text" name="mothernumber" defaultValue={row.mothernumber} onChange={handleEditChange} /><br />
                                                <label htmlFor="motherid">Mother's Id</label><br />
                                                <input type="text" name="motherid" defaultValue={row.motherid} onChange={handleEditChange} /><br />
                                            </fieldset>
                                        </div>
                                        <button className="btn" style={{
                                            display: "block",
                                            margin: "auto",
                                            width: "100px"
                                        }}>Save Edit</button>
                                    </form>
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


    const [balanceData, setBalanceData] = useState({
        balance: "",
        id: Cookies.get('id')
    });

    const handleBalanceChange = (event) => {
        const {name, value} = event.target;
        setBalanceData({...balanceData, [name]: value})
        console.log(balanceData);
    };

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

    const [editData, setEditData] = useState({
        studentname: "",
        admsno: "",
        bcn: "",
        grade: "",
        gender: "",
        dob: "",
        admissiongrade: "",
        admissiondate: "",
        remarks: "",
        imageName: "",
        fathername: "",
        fathernumber: "",
        fatherid: "",
        mothername: "",
        mothernumber: "",
        motherid: "",
        id: Cookies.get('id')
    });

    const [transferData, setTransferData] = useState({
        transferto: "",
        transferdate: "",
        transferreason: "",
        id: Cookies.get('id')
    });

    const handleEditChange = (event) => {
        const {name, value} = event.target;
        setEditData({...editData, [name]: value.toUpperCase()})
        console.log(editData);
    };

    const handleTransferChange = (event) => {
        const {name, value} = event.target;
        setTransferData({...transferData, [name]: value.toUpperCase()})
        console.log(transferData);
    };

    const handleEditImgChange = (event) => {
        setImgFile(event.target.files[0]);

        const imgName = event.target.files[0];
        setEditData({...editData, imageName: imgName.name});
        console.log(editData);

        const imgFile2 = event.target.files[0];

        if (imgFile2) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            }
            reader.readAsDataURL(imgFile2);
        } else {
            setPreviewImage();
        }
    }

    const editStudent = (event) => {
        event.preventDefault();
        setFeedback(false);

        const postImageEdit = async () => {
            if (imgFile) {
                try {
                    const imageRef = await ref(storage, `studentImages/${imgFile.name}`);
                    uploadBytes(imageRef, imgFile).then(() => {
                        console.log("Image uploaded");
                    })
                } catch(error) {
                    console.log(error);
                }
            }
        }

        postImageEdit();
        
        axios
            .post('http://127.0.0.1/api/editData.php', editData)
            .then((response) => {
                console.log(response.data);
                if (response.data === "Done") {
                    setEditSuccess(true);
                    handleEditStudent();
                    setOpen2(true);
                    setFeedback(true);
                } else if (response.data === "Failed") {
                    setEditSuccess(false);
                    handleEditStudent();
                    setOpen2(true);
                    setFeedback(true);
                } else {
                    setEditSuccess(false);
                    handleEditStudent();
                    setOpen2(true);
                    setFeedback(true);
                }
            })
            .catch((error) => {
                alert(error);
            })
    }

    const gotoAllStudents = () => {
        setTimeout(function() {
            alert("Student transfered successfully!");
            navigate("/allstudents");
            setFeedback(true);
        });
    }

    const transferStudent = (event) => {
        event.preventDefault();
        setFeedback(false);
        
        axios
            .post('http://127.0.0.1/api/transferData.php', transferData)
            .then((response) => {
                console.log(response.data);
                if (response.data === "Done") {
                    gotoAllStudents();
                    setTransferSuccess(true);
                    setOpenTransfer(true);
                } else if (response.data === "Failed") {
                    setTransferSuccess(false);
                    handleTransferStudent();
                    setOpenTransfer(true);
                    setFeedback(true);
                } else if (response.data === "Balance") {
                    setBalancePresent(false);
                    setOpenTransfer(true);
                    setFeedback(true);
                } else {
                    setTransferSuccess(false);
                    handleTransferStudent();
                    setOpenTransfer(true);
                    setFeedback(true);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const addBalance = (event) => {
        event.preventDefault();
        setFeedback(false);

        //Make HTTP POST request to PHP script
        axios
            .post('http://127.0.0.1/api/AddBalance.php', balanceData)
            .then((response) => {
                console.log(response.data);
                if (response.data === "Done") {
                    setBalanceSuccess(true);
                    setOpenBalance(true);
                    setFeedback(true);
                } else if (response.data == null) {
                    setBalanceSuccess(false);
                    setOpenBalance(true);
                    setFeedback(false);
                } else {
                    setBalanceSuccess(false);
                    setOpenBalance(true);
                    setFeedback(true);
                }
            })
            .catch((error) => {
                console.log(error);
                setBalanceSuccess(false);
                setOpenBalance(true);
                setFeedback(true);
            });
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

    const handleUndoPayment = (row) => {
        let undoPayment = window.confirm("Are you sure you want to undo this payment of amount " + row.amount + "?");

        if (undoPayment) {
            axios
                .post('http://127.0.0.1/api/UndoPayment.php', row.paymentid)
                .then((response) => {
                    console.log(response.data);
                    if (response.data === "Done") {
                        setUndoPayment(true);
                        setOpenUndoPayment(true);
                        setFeedback(true);
                    } else if (response.data == null) {
                        setUndoPayment(false);
                        setOpenUndoPayment(true);
                        setFeedback(false);
                    } else {
                        setUndoPayment(false);
                        setOpenUndoPayment(true);
                        setFeedback(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setUndoPayment(false);
                    setOpenUndoPayment(true);
                    setFeedback(true);
                });
        } else {
            return;
        }
    }


    useEffect(() => {
        axios
            .post('http://127.0.0.1/api/Payments.php', JSON.stringify(studentId))
            .then((response) => {
                if (response.data === "Failed") {
                    setSuccess(true);
                    setFeedback(true);
                    setOpen(true);
                } else if (response.data == null) {
                    setDataFound(false);
                    setFeedback(true);
                    setOpenPaymentData(true);
                } else {
                    data = response.data.map(function (row) {
                        return (
                            <tr key={row.paymentid} onClick={() => handleUndoPayment(row)}>
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
                  New Payment unsuccessfull!
                </Alert>
              </Snackbar>}

              {dataFound ? "" : <Snackbar open={openPaymentData} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  No Payment Data!
                </Alert>
              </Snackbar>}

              {editSuccess ? <Snackbar open={open2} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                  Changes saved successfully!
                </Alert>
              </Snackbar> : <Snackbar open={open2} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  Changes not saved!
                </Alert>
              </Snackbar>}

              {transferSuccess ? <Snackbar open={openTransfer} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                  Student transfered successfully!
                </Alert>
              </Snackbar> : <Snackbar open={openTransfer} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  Student transfer error!
                </Alert>
              </Snackbar>}

              {deletionSuccess ? "" : <Snackbar open={openTransfer} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  Student deletion was unsuccessfull!
                </Alert>
              </Snackbar>}

              {balancePresent ? "" : <Snackbar open={openTransfer} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  Student transfer error! Please add student balance first.
                </Alert>
              </Snackbar>}

              {balanceSuccess ? <Snackbar open={openBalance} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                  New Balance Added successfully!
                </Alert>
              </Snackbar> : <Snackbar open={openBalance} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  Error adding new balance!
                </Alert>
              </Snackbar>}

              {
                undoPayment ? <Snackbar open={openUndoPayment} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                  Payment Undone!
                </Alert>
              </Snackbar> : <Snackbar open={openUndoPayment} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  Undo Payment Failed!
                </Alert>
              </Snackbar>
              }
            
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
 
export default Student;