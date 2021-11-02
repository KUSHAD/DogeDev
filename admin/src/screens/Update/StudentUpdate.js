import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import clientCreds from "../../client_creds.json";
import constants from "../../constants";
import { useFetchMaster } from "../../contexts/FetchMaster";
import { useAuthProvider } from "../../contexts/Auth";

export default function StudentUpdate({ setError, setSuccess, onClose }) {
  const [reg, setReg] = useState("");
  const [sub, setSub] = useState("SKATING");
  const [doa, setDoa] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fields, setStudentsAdd, studentsAdd } = useFetchMaster();
  const { user } = useAuthProvider();
  async function onUpdate() {
    try {
      setIsSubmitting(true);
      const doc = new GoogleSpreadsheet(constants.SPREADSHEET.ID);
      await doc.useServiceAccountAuth(clientCreds);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[2];
      const rows = await sheet.getRows();
      const filteredRow = rows.filter((row) => row.SR === reg);
      const row = filteredRow[0];

      const d = new Date(doa);
      const dateString =
        d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

      const addToRow = {
        SR: row.SR,
        NAME: row.NAME,
        DATE_OF_ADMISSION: dateString,
        BLOOD_GROUP: row.BLOOD_GROUP,
        DOB: row.DOB,
        SUBJECT: sub,
        EDUCATION: row.EDUCATION,
        CONTACT: row.CONTACT,
        MOTHER: row.MOTHER,
        FATHER: row.FATHER,
        ADDRESS: row.ADDRESS,
        EMAIL: row.EMAIL,
        WHATSAPP: row.WHATSAPP,
        ISSUED_BY: user,
      };

      await sheet.addRow(addToRow);
      await setStudentsAdd([addToRow, ...studentsAdd]);

      setSuccess("Data updated succesfully");
    } catch (error) {
      setError(error.message);
    } finally {
      setSub("SKATING");
      setReg("");
      setIsSubmitting(false);
      onClose();
    }
  }
  return (
    <>
      <Form.Group id="sb" className="mb-2">
        <FloatingLabel label="Student Registration ID">
          <Form.Control
            readOnly={isSubmitting}
            value={reg}
            onChange={(e) => setReg(e.target.value.toUpperCase().trim())}
            placeholder="h"
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group id="sub" className="mb-2">
        <FloatingLabel label="Subject">
          <Form.Select
            disabled={isSubmitting}
            value={sub}
            onChange={(e) => setSub(e.target.value.toUpperCase())}
          >
            {fields
              .filter((field) => field.ADMISSION_SUBJECTS !== undefined)
              .map((field) => (
                <option
                  value={field.ADMISSION_SUBJECTS}
                  key={field.ADMISSION_SUBJECTS}
                >
                  {field.ADMISSION_SUBJECTS}
                </option>
              ))}
          </Form.Select>
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mb-2">
        <FloatingLabel label="Date of admission">
          <Form.Control
            type="date"
            disabled={isSubmitting}
            value={doa}
            onChange={(e) => setDoa(e.target.value.toUpperCase())}
          />
        </FloatingLabel>
      </Form.Group>
      <Button
        onClick={onUpdate}
        disabled={!reg || !sub || isSubmitting || !doa}
        className="mt-2 w-100"
      >
        Update
      </Button>
    </>
  );
}
