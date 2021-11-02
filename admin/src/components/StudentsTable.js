import { useCallback, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { getDoc, setDoc } from "firebase/firestore/lite";
import { database } from "../firebase";
export default function StudentsTable({ student, setError, date }) {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const checkToggle = async () => {
      try {
        setError("");
        setChecked(false);
        const doc = await getDoc(database.att(student.SR));
        if (
          doc.exists() &&
          doc.data()[student.SUBJECT] &&
          doc.data()[student.SUBJECT].includes(date)
        ) {
          setChecked(true);
        } else {
          setChecked(false);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    checkToggle();
  }, [setError, date, student]);

  const attendanceUser = useCallback(async () => {
    try {
      setError("");
      setDisabled(true);
      const docExists = await (await getDoc(database.att(student.SR))).exists();
      if (docExists) {
        const doc = await getDoc(database.att(student.SR));
        if (checked) {
          if (
            doc.data()[student.SUBJECT] &&
            doc.data()[student.SUBJECT].length !== 0
          ) {
            const obj = {
              ...doc.data(),
              id: student.SR,
              name: student.NAME,
            };
            obj[student.SUBJECT].push(date);
            const setDates = [...new Set(obj[student.SUBJECT])];
            obj[student.SUBJECT] = setDates;
            await setDoc(database.att(student.SR), obj);
          } else {
            const obj = {
              ...doc.data(),
              id: student.SR,
              name: student.NAME,
            };
            obj[student.SUBJECT] = [date];
            const setDates = [...new Set(obj[student.SUBJECT])];
            obj[student.SUBJECT] = setDates;
            await setDoc(database.att(student.SR), obj);
          }
        } else {
          const newData = doc
            .data()
            [student.SUBJECT].filter((sub) => sub !== date);
          const obj = {
            ...doc.data(),
            id: student.SR,
            name: student.NAME,
          };
          obj[student.SUBJECT] = newData;
          await setDoc(database.att(student.SR), obj);
        }
      } else {
        if (checked) {
          const obj = {
            name: student.NAME,
            id: student.SR,
          };
          obj[student.SUBJECT] = [date];
          await setDoc(database.att(student.SR), obj);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setDisabled(false);
    }
  }, [setError, student, date, checked]);

  useEffect(() => {
    attendanceUser();
  }, [attendanceUser]);
  return (
    <tr key={student.SR}>
      <td>{student.SR}</td>
      <td>{student.NAME}</td>
      <td>
        <Form.Switch
          disabled={disabled}
          checked={checked}
          label={checked ? "Present" : "Absent"}
          onChange={() => setChecked(!checked)}
        />
      </td>
    </tr>
  );
}
