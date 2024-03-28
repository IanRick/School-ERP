import React, {useState} from 'react';
import Signin from './Signin';
import Home from './Home';
import Cookies from 'js-cookie';
import {sessionContext} from './SessionContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import Signup from './Signup';
import AddStudent from './AddStudent';
import AllStudents from './AllStudents';
import Student from './Student';
import AllTransferedStudents from './AllTransferedStudents';
import TransferedStudent from './TransferedStudent';
import AllFees from './AllFees';
import DeletedFees from './DeletedFees';


function App() {

  const [session, setSession] = useState(Cookies.get('session'));
  const [studentid, setStudentid] = useState();

  return (
    <div className="App">
      <sessionContext.Provider value={{session, setSession, studentid, setStudentid}}>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/addstudent' element={<AddStudent />} />
          <Route path='/allstudents' element={<AllStudents />} />
          <Route path='/student' element={<Student />} />
          <Route path='/transferedstudent' element={<TransferedStudent />} />
          <Route path='/alltransferedstudents' element={<AllTransferedStudents />} />
          <Route path='/allfees' element={<AllFees />} />
          <Route path='/deletedfees' element={<DeletedFees />} />
        </Routes>
      </Router>
      </sessionContext.Provider>
    </div>
  );
}

export default App;
