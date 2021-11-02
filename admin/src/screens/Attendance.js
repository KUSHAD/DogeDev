import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Centered from "../components/Centered";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import { useFetchMaster } from "../contexts/FetchMaster";
import StudentsTable from "../components/StudentsTable";
import Button from "react-bootstrap/Button";
export default function Attendance() {
  const { studentsAdd, fields } = useFetchMaster();
  const [sub, setSub] = useState("");
  const [date, setDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState("");
  const [filteredArr, setFilteredArr] = useState(studentsAdd);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function filterUsers(e) {
    try {
      setShowTable(false);
      e.preventDefault();
      setIsSubmitting(true);
      const newArr = studentsAdd.filter((f) => f.SUBJECT === sub);
      setFilteredArr(newArr);
      setShowTable(true);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Centered>
        <Form onSubmit={filterUsers}>
          <Form.Group id="sub" className="mb-2">
            <FloatingLabel label="Date">
              <Form.Control
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setShowTable(false);
                }}
                type="date"
                placeholder="s"
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group id="sub" className="mb-2">
            <FloatingLabel label="Subject">
              <Form.Select
                disabled={isSubmitting}
                value={sub}
                onChange={(e) => {
                  setSub(e.target.value.toUpperCase());
                  setShowTable(false);
                }}
              >
                <option value="">------ Choose ------</option>
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
          <Button disabled={!sub || !date} type="submit" className="w-100 mt-2">
            Make Attendance
          </Button>
        </Form>

        {showTable && (
          <>
            {error && (
              <Alert
                dismissible
                onClose={() => setError("")}
                variant="danger"
                className="mt-2"
              >
                <Alert.Heading>Error</Alert.Heading>
                <p>{error}</p>
              </Alert>
            )}
            <Table striped bordered hover responsive variant="dark" size="sm">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredArr.map((student, index) => (
                  <StudentsTable
                    setError={setError}
                    student={student}
                    key={index}
                    date={date}
                  />
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Centered>
    </>
  );
}
