import React, {useState, useEffect, useContext} from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { sessionContext } from "./SessionContext";
import AddStudentCSS from './AddStudent.module.css';
import axios from "axios";
import avatar from "./images/avatar.png";
import { storage } from "./firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const AddStudent = () => {
    useEffect(() => {
        if (session === '' || session == null) {
            return navigate('/signin');
        }
    })

    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    const {session} = useContext(sessionContext);
    const [feedback, setFeedback] = useState(true);
    const [previewImage, setPreviewImage] = useState();
    const [success, setSuccess] = useState(false);
    const [imgFile, setImgFile] = useState();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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
    });

    //Handle form data changes
    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value.toUpperCase()})
        console.log(formData);
    }

    const handleImgChange = (event) => {
        setImgFile(event.target.files[0]);

        const imgName = event.target.files[0];
        if (imgName) {
            setFormData({...formData, imageName: imgName.name});
        } else {
            setFormData({...formData, imageName: "avatar.png"});
        }
        console.log(formData);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        setFeedback(false);

        if (imgFile) {
            const imageRef = ref(storage, `studentImages/${imgFile.name}`);

            uploadBytes(imageRef, imgFile).then(() => {
                console.log("Image uploaded");
            })
        } else {
            console.log("No image uploaded. Avatar will be used!");
        }
        

        //Make HTTP POST request to PHP script
        axios
            .post('http://127.0.0.1/api/AddStudent.php', formData)
            .then((response) => {
                console.log(response.data);
                if (response.data === 'Done') {
                    setSuccess(true);
                    setOpen(true);
                } else {
                    setSuccess(false);
                    setOpen(true);
                }
            })
            .catch((error) => {
                console.log(error);
            });

        setTimeout(function() {
            window.location.reload();
            setFeedback(true);
        }, 3100);
    };

    return (
        <div className={AddStudentCSS.form2}>
            <Navbar />
            
            <form onSubmit={handleSubmit}>
                <h1>Add New Student</h1>
                <div className={AddStudentCSS.fieldsetCont}>
                    <fieldset>
                        <legend>Student Info</legend>
                        <label htmlFor='studentname'>Name of student</label><br />
                        <input type="text" name="studentname" required onChange={handleChange} /><br />
                        <label htmlFor="admsno">Admission Number</label><br />
                        <input type="text" name="admsno" onChange={handleChange} /><br />
                        <label htmlFor='bcn'>Birth Certificate Number</label><br />
                        <input type="text" name="bcn" onChange={handleChange} /><br />
                        <label htmlFor='grade'>Grade</label><br />
                        <select name="grade" required onChange={handleChange}>
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
                        <select name="gender" required onChange={handleChange}>
                            <option value="MALE">MALE</option>
                            <option value="FEMALE">FEMALE</option>
                        </select><br />
                        <label htmlFor="dob">Date of Birth</label><br />
                        <input type="date" name="dob" onChange={handleChange} /><br />
                        <label htmlFor="admissiongrade">Grade admitted to:</label><br />
                        <select name="admissiongrade" required onChange={handleChange}>
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
                        <input type="date" name="admissiondate" onChange={handleChange} /><br />
                        <label htmlFor="imgFile">Student Image</label>
                        <input type="file" accept=".png, .jpg, .jpeg" onChange={handleImgChange} />
                        <img src={previewImage ? previewImage : avatar} alt="Student" height="100px" width="100px" />
                    </fieldset>
                    <fieldset>
                        <legend>Parents info</legend>
                        <label htmlFor="fathername">Father's Name</label><br />
                        <input type="text" name="fathername" onChange={handleChange} /><br />
                        <label htmlFor="fathernumber">Father's Number</label><br />
                        <input type="text" name="fathernumber" onChange={handleChange} /><br />
                        <label htmlFor="fatherid">Father's Id</label><br />
                        <input type="text" name="fatherid" onChange={handleChange} /><br />
                        <label htmlFor="mothername">Mother's Name</label><br />
                        <input type="text" name="mothername" onChange={handleChange} /><br />
                        <label htmlFor="mothernumber">Mother's Number</label><br />
                        <input type="text" name="mothernumber" onChange={handleChange} /><br />
                        <label htmlFor="motherid">Mother's Id</label><br />
                        <input type="text" name="motherid" onChange={handleChange} /><br />
                        <label htmlFor="remarks">Remarks</label><br />
                        <textarea name="remarks" cols="50" rows="10" onChange={handleChange}></textarea><br />
                    </fieldset>
                </div>
                <button className="btn">Submit</button>
            </form>
            {
                success ? <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                  Student added successfully!
                </Alert>
              </Snackbar> : <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                Error adding student!
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
 
export default AddStudent;