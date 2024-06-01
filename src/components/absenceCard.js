import React from 'react'
import "../App.css";

export default function AbsenceCard({ absense, handleOpen, width = "100%" }) {
    const startDate = new Date(absense.startDate);

    const startDateString = `${startDate.getDate()}/${startDate.getMonth() + 1
        }/${startDate.getFullYear()}`;
    let endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + absense.days);

    const endDateString = `${endDate.getDate()}/${endDate.getMonth() + 1
        }/${endDate.getFullYear()}`;


    const showAllAbsense = () => {
        if (handleOpen) {
            handleOpen(absense.employee.id)
        }

    }
    return (
        <div className={"AbsenceContainer"} style={{ width: width }}>
            <p onClick={showAllAbsense}>
                <b>name:</b> {absense.employee.firstName} {absense.employee.lastName}
            </p>
            <p>Start Date: {startDateString}</p>
            <p>End Date: {endDateString}</p>
            <p>Absence Type: {absense.absenceType}</p>
            <p style={{ color: absense.isConflict && "red" }}>
                Conflict: {absense.isConflict ? "true" : "false"}
            </p>
        </div>
    )
}
