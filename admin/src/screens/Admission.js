import Centered from "../components/Centered";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useForm } from "react-hook-form";
import constants from "../constants";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Loading from "../components/Loading";
import { useAuthProvider } from "../contexts/Auth";
import { GoogleSpreadsheet } from "google-spreadsheet";
import clientCreds from "../client_creds.json";
import Prompt from "../components/Prompt";
import StudentQuery from "./Query/StudentQuery";
import StudentUpdate from "./Update/StudentUpdate";
import { useFetchMaster } from "../contexts/FetchMaster";
import Offcanvas from "react-bootstrap/Offcanvas";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import RegPDF from "../pdfs/RegPDF";

export default function Admission() {
  const { fields, setStudentsAdd, studentsAdd } = useFetchMaster();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm({
    mode: "all",
    defaultValues: {
      doa: "",
      name: "",
      sex: "MALE",
      blood: "NOT KNOWN",
      dob: "",
      sub: "SKATING",
      ed: "",
      tel: "",
      mother: "",
      father: "",
      address: "",
      email: "",
      wa: "",
      dis: "",
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuthProvider();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pdfData, setPdfData] = useState({
    id: "",
    name: "",
    subject: "",
    dob: "",
    father: "",
    mother: "",
    address: "",
  });
  async function addDataToSheet(data) {
    const doc = new GoogleSpreadsheet(constants.SPREADSHEET.ID);
    await doc.useServiceAccountAuth(clientCreds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[2];
    const rows = await sheet.getRows({
      offset: 0,
    });
    let lastElem = 0;
    let str = "";
    let newRowLength = "";
    if (rows.length === 0) {
      newRowLength = 1;
    } else {
      lastElem = rows[rows.length - 1];
      if (lastElem.SR.split("-")[1].includes("STUDENT")) {
        newRowLength =
          Number(lastElem.SR.split("-")[1].replace("STUDENT", "")) + 1;
      }
      if (lastElem.SR.split("-")[1].includes("LABOUR")) {
        newRowLength =
          Number(lastElem.SR.split("-")[1].replace("LABOUR", "")) + 1;
      }
      if (lastElem.SR.split("-")[1].includes("TEACHER")) {
        newRowLength =
          Number(lastElem.SR.split("-")[1].replace("TEACHER", "")) + 1;
      }
    }
    str = "" + newRowLength;
    const pad = "000000";
    const ans = pad.substring(0, pad.length - str.length) + str;
    const month = new Date().getMonth() + 1;
    let year, nextYear;
    if (month > 3) {
      year = new Date().getFullYear();
      nextYear = year + 1;
    }
    if (month <= 3) {
      nextYear = new Date().getFullYear();
      year = nextYear - 1;
    }
    const d = new Date(data.dob);
    const dateString =
      d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
    const doa = new Date(data.doa);
    const doaDateString =
      doa.getMonth() + 1 + "/" + doa.getDate() + "/" + doa.getFullYear();
    let sr;
    if (data.sub === "LABOUR") {
      sr = `SV-Labour${ans}-${year}-${nextYear}`.toUpperCase();
    } else if (data.sub === "TEACHER") {
      sr = `SV-Teacher${ans}-${year}-${nextYear}`.toUpperCase();
    } else {
      sr = `SV-Student${ans}-${year}-${nextYear}`.toUpperCase();
    }
    const row = {
      SR: sr,
      NAME: data.name.toUpperCase(),
      DATE_OF_ADMISSION: doaDateString,
      BLOOD_GROUP: data.blood.toUpperCase(),
      DOB: dateString,
      SUBJECT: data.sub.toUpperCase(),
      EDUCATION: data.ed.toUpperCase(),
      CONTACT: data.tel.toUpperCase(),
      MOTHER: data.mother.toUpperCase(),
      FATHER: data.father.toUpperCase(),
      ADDRESS: data.address.toUpperCase(),
      EMAIL: data.email.toUpperCase(),
      WHATSAPP: data.wa,
      DISEASE: data.dis.toUpperCase(),
      ISSUED_BY: user,
    };
    await sheet.addRow(row);
    setStudentsAdd([row, ...studentsAdd]);
    setSuccess(`Data added Successfully! Registration ID :-  ${sr}`);
  }
  async function onSubmit(data) {
    try {
      await setError("");
      await setSuccess("");
      await addDataToSheet(data);
      reset();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <Prompt
        header="Search Student Details"
        body={
          <StudentQuery
            onClose={() => setModalOpen(false)}
            setIsOpen={setIsOpen}
            setPDFData={setPdfData}
          />
        }
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <Prompt
        header="Add Student Subject"
        body={
          <StudentUpdate
            setError={setError}
            setSuccess={setSuccess}
            onClose={() => setUpdateModal(false)}
          />
        }
        isOpen={updateModal}
        onClose={() => setUpdateModal(false)}
      />
      <Loading isOpen={isSubmitting} />
      <Centered>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-2">Registration</h2>
            {error && (
              <Alert dismissible onClose={() => setError("")} variant="danger">
                <Alert.Heading>Error</Alert.Heading>
                <p>{error}</p>
              </Alert>
            )}
            {success && (
              <Alert
                dismissible
                onClose={() => setSuccess("")}
                variant="success"
              >
                <Alert.Heading>Success</Alert.Heading>
                <p>{success}</p>
              </Alert>
            )}
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Form.Group id="doa" className="mb-2">
                <FloatingLabel label="Date of Admission *">
                  <Form.Control
                    isInvalid={errors?.doa}
                    isValid={dirtyFields?.doa && !errors?.doa}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    {...register("doa", {
                      required: "Date of admission is required",
                    })}
                    type="date"
                    placeholder="d"
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.doa?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="name" className="mb-2">
                <FloatingLabel label="Name *">
                  <Form.Control
                    isInvalid={errors?.name}
                    isValid={dirtyFields?.name && !errors?.name}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    {...register("name", {
                      required: "Name is required",
                    })}
                    type="text"
                    placeholder="d"
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.name?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="sex" className="mb-2">
                <FloatingLabel label="Sex *">
                  <Form.Select
                    isInvalid={errors.sex}
                    isValid={!errors.sex}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    {...register("sex", {
                      required: "Sex is required",
                    })}
                  >
                    {constants.SEX.map((sex) => (
                      <option value={sex} key={sex}>
                        {sex}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.sex?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="blood-gorup" className="mb-2">
                <FloatingLabel label="Blood Group *">
                  <Form.Select
                    isInvalid={errors.blood}
                    isValid={!errors.blood}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    {...register("blood", {
                      required: "Blood group is required",
                    })}
                  >
                    {constants.BLOOD_GROUP.map((group) => (
                      <option value={group} key={group}>
                        {group}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.blood?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="dob" className="mb-2">
                <FloatingLabel label="Date of birth *">
                  <Form.Control
                    isInvalid={errors?.dob}
                    isValid={dirtyFields?.dob && !errors?.dob}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    type="date"
                    placeholder="a"
                    {...register("dob", {
                      required: "Date of birth is required",
                    })}
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.dob?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="sub" className="mb-2">
                <FloatingLabel label="Subject *">
                  <Form.Select
                    isInvalid={errors.sub}
                    isValid={!errors.sub}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    {...register("sub", {
                      required: "Game subject is required",
                    })}
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
                  <Form.Text className="text-danger">
                    {errors?.sub?.message}
                  </Form.Text>
                </FloatingLabel>
              </Form.Group>
              <Form.Group id="ed" className="mb-2">
                <FloatingLabel label="Education Qualification *">
                  <Form.Control
                    isInvalid={errors?.ed}
                    isValid={dirtyFields?.ed && !errors?.ed}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    placeholder="a"
                    {...register("ed", {
                      required: "Education qualification is required",
                    })}
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.ed?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="cn" className="mb-2">
                <FloatingLabel label="Contact No *">
                  <Form.Control
                    isInvalid={errors?.tel}
                    isValid={dirtyFields?.tel && !errors?.tel}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    type="tel"
                    placeholder="a"
                    {...register("tel", {
                      required: "Contact number is required",
                      validate: (value) =>
                        value.length === 10 ||
                        "Mobile number should have 10 digits",
                    })}
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.tel?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="moth" className="mb-2">
                <FloatingLabel label="Mother's Name *">
                  <Form.Control
                    isInvalid={errors?.mother}
                    isValid={dirtyFields?.mother && !errors?.mother}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    placeholder="a"
                    {...register("mother", {
                      required: "Mother's name is required",
                    })}
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.mother?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="fath" className="mb-2">
                <FloatingLabel label="Father's Name *">
                  <Form.Control
                    isInvalid={errors?.father}
                    isValid={dirtyFields?.father && !errors?.father}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    placeholder="a"
                    {...register("father", {
                      required: "Father's name is required",
                    })}
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.father?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="add" className="mb-2">
                <FloatingLabel label="Address *">
                  <Form.Control
                    isInvalid={errors?.address}
                    isValid={dirtyFields?.address && !errors?.address}
                    {...register("address", {
                      required: "Address is required",
                    })}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    placeholder="a"
                    as="textarea"
                  />
                  <Form.Text className="text-danger">
                    {errors?.address?.message}
                  </Form.Text>
                </FloatingLabel>
              </Form.Group>
              <Form.Group id="mail" className="mb-2">
                <FloatingLabel label="Email *">
                  <Form.Control
                    isInvalid={errors?.email}
                    isValid={dirtyFields?.email && !errors?.email}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    placeholder="a"
                    type="email"
                    {...register("email", {
                      pattern: {
                        value: constants.EMAIL_REGEX,
                        message: "Email not valid",
                      },
                    })}
                  />
                  <Form.Text className="text-danger">
                    {errors?.email?.message}
                  </Form.Text>
                </FloatingLabel>
              </Form.Group>
              <Form.Group id="wa" className="mb-2">
                <FloatingLabel label="Whatsapp No. *">
                  <Form.Control
                    isInvalid={errors?.wa}
                    isValid={dirtyFields?.wa && !errors?.wa}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    placeholder="a"
                    type="tel"
                    {...register("wa", {
                      minLength: {
                        value: 10,
                        message: "Whatsapp number should have 10 digits",
                      },
                      maxLength: {
                        value: 10,
                        message: "Whatsapp number should have 10 digits",
                      },
                    })}
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.wa?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="dis" className="mb-2">
                <FloatingLabel label="Dissease (If any)">
                  <Form.Control
                    isInvalid={errors?.dis}
                    isValid={dirtyFields?.dis && !errors?.dis}
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    placeholder="a"
                    {...register("dis")}
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.dis?.message}
                </Form.Text>
              </Form.Group>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-100 mt-2"
              >
                Add
              </Button>
            </Form>
            <div className="d-flex flex-row justify-content-between">
              <Button
                onClick={() => setModalOpen(true)}
                variant="info"
                className="w-50 mt-2 me-2"
              >
                Query
              </Button>
              <Button
                onClick={() => setUpdateModal(true)}
                variant="secondary"
                className="w-50 mt-2 ms-2"
              >
                Add Subject
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Centered>
      <Offcanvas show={isOpen} onHide={() => setIsOpen(false)} backdrop={false}>
        <Offcanvas.Header closeButton closeLabel="Close">
          <Offcanvas.Title>PDF Options</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <PDFViewer
            showToolbar={false}
            id="student-pdf-viewer"
            name="student-pdf-viewer"
            height="56.5%"
            width="100%"
          >
            <RegPDF data={pdfData} />
          </PDFViewer>
          <PDFDownloadLink
            className="d-flex flex-row justify-content-between text-decoration-none"
            document={<RegPDF data={pdfData} />}
          >
            {({ blob, url, loading, error }) => {
              return (
                <Button
                  disabled={loading || error}
                  variant={error ? "danger" : "outline-primary"}
                  className="w-100"
                  onClick={(e) => {
                    e.preventDefault();
                    window.frames["student-pdf-viewer"].focus();
                    window.frames["student-pdf-viewer"].print();
                  }}
                >
                  {error ? "There was an error :-" + error.message : "Print"}
                </Button>
              );
            }}
          </PDFDownloadLink>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
