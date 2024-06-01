import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import AbsenceCard from "./components/absenceCard"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


const style = {
  box: {
    textAlign: "center",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflow: "auto"
  },

  modalAbsence: {
    display: "flex",
    flexDirection: "column",
    gap: 10,

  }
};

function App() {
  const [absences, setAbsences] = useState([]);
  const [sortState, setSortState] = useState();

  const [targetUser, setTargetUser] = useState(null);
  const handleOpen = targetUser => setTargetUser(targetUser);
  const handleClose = () => setTargetUser(null);


  const isAbsenceConflict = async (id) => {
    try {
      const response = await axios.get(
        "https://front-end-kata.brighthr.workers.dev/api/conflict/" + id
      );
      return response.data.conflicts;
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const initDate = async (id) => {
    try {
      const response = await axios.get(
        "https://front-end-kata.brighthr.workers.dev/api/absences"
      );

      let result = [];
      await Promise.all(
        response.data.map(async (item) => {
          const isConflict = await isAbsenceConflict(item.id);
          result.push({
            ...item,
            isConflict,
          });
        })
      );

      setAbsences(result);
      return response;
    } catch (error) {
      console.error(error);
      return;
    }
  };

  useEffect(() => {
    initDate();
  }, []);

  const sortingAbsences = (a, b) => {

    if (sortState === "ByName") {
      const result = a.employee.firstName.localeCompare(b.employee.firstName);
      return result !== 0 ? result : a.employee.lastName.localeCompare(b.employee.lastName);

    }

    if (sortState === "ById") {
      const result = a.id - b.id;
      return result
    }

    if (sortState === "ByDate") {
      const result = new Date(a.startDate) - new Date(b.startDate);
      return result
    }

    if (sortState === "ByAbsence") {
      return a.absenceType.localeCompare(b.absenceType);
    }
    return 0
  }

  const setSortStateByName = () => {

    setSortState("ByName")
  }
  const setSortStateById = () => {
    setSortState("ById")
  }

  const setSortStateByDate = () => {
    setSortState("ByDate")
  }

  const setSortStateByAbsence = () => {
    setSortState("ByAbsence")
  }

  return (
    <div className="App">
      <h1>Peninsula Absences</h1>
      <div className={"BtnContainer"}>
        <Button variant="contained" onClick={setSortStateByName}>Sort by Name</Button>
        <Button variant="contained" onClick={setSortStateById}>Sort by Id</Button>
        <Button variant="contained" onClick={setSortStateByDate}>Sort by Date</Button>
        <Button variant="contained" onClick={setSortStateByAbsence}>Sort by Absence Type</Button>
      </div>
      <div className={"mainContainer"}>
        {absences.sort(sortingAbsences).map((absense) => <AbsenceCard absense={absense} handleOpen={handleOpen} width={"30%"} />)}
      </div>

      <Modal
        open={targetUser}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.box}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            All User Absence
          </Typography>
          <Box style={style.modalAbsence}>
            {absences.filter(absense => absense.employee.id === targetUser).map((absense) => <AbsenceCard absense={absense} />)}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default App;
