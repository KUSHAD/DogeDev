import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Centered from "../components/Centered";
import constants from "../constants";
import { useForm } from "react-hook-form";
import Loading from "../components/Loading";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import clientCreds from "../client_creds.json";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import Offcanvas from "react-bootstrap/Offcanvas";
import ExpenditurePDF from "../pdfs/ExpenditurePDF";
import { useAuthProvider } from "../contexts/Auth";
import Prompt from "../components/Prompt";
import ExpenditureQuery from "./Query/ExpenditureQuery";
import { useFetchMaster } from "../contexts/FetchMaster";

export default function Expenditure() {
  const { fields } = useFetchMaster();
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm({
    mode: "all",
    defaultValues: {
      type: "CONSTRUCTION MATERIAL",
      desc: "",
      amt: "",
      date: "",
      name: "",
      ph: "",
      mode: "CASH",
      cashMode: "",
      chequeNo: "",
      chequeDate: "",
      upiId: "",
      upiPh: "",
      bank: "",
      subBy: "",
    },
  });
  const [isDownload, setIsDownload] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuthProvider();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [srl, setSrl] = useState("");
  const [pdfData, setPdfData] = useState({
    type: "CONSTRUCTION MATERIAL",
    desc: "",
    amt: "",
    date: "",
    name: "",
    ph: "",
    mode: "CASH",
    cashMode: "",
    chequeNo: "",
    chequeDate: "",
    upiId: "",
    upiPh: "",
    bank: "",
  });
  const watchFields = watch();
  async function addDataToSheet(data) {
    const doc = new GoogleSpreadsheet(constants.SPREADSHEET.ID);
    await doc.useServiceAccountAuth(clientCreds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];
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
      newRowLength = Number(lastElem.SR_NO.split("-")[2]) + 1;
    }

    str = "" + newRowLength;

    const pad = "000000";
    const ans = pad.substring(0, pad.length - str.length) + str;

    const month = new Date().getMonth() + 1;
    let year, nextYear;
    if (month > 3) {
      year = new Date().getFullYear();
      nextYear = year + 1;
      await setSrl(`SV-PAY-${ans}-${year}-${nextYear}`);
    }
    if (month <= 3) {
      nextYear = new Date().getFullYear();
      year = nextYear - 1;
      await setSrl(`SV-PAY-${ans}-${year}-${nextYear}`);
    }

    const d = new Date(data.date);
    const dateString =
      d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
    const row = {
      SR_NO: `SV-PAY-${ans}-${year}-${nextYear}`,
      TYPE: data.type.toUpperCase(),
      DESCRIPTION: data.desc.toUpperCase(),
      AMOUNT: data.amt,
      BILL_SUBMITTED_BY: data.subBy.toUpperCase(),
      DATE: dateString,
      NAME: data.name.toUpperCase(),
      MOBILE_NUMBER: data.ph.toUpperCase(),
      MODE_OF_PAYMENT: data.mode.toUpperCase(),
      PAN_CARD_OR_AADHAR_CARD_NUMBER: data.cashMode.toUpperCase(),
      CHEQUE_OR_DD_NO: data.chequeNo.toUpperCase(),
      BANK: data.bank.toUpperCase(),
      DATE_OF_CHEQUE_OR_DD_ISSUE: data.chequeDate.toUpperCase(),
      UPI_ID: data.upiId.toUpperCase(),
      UPI_PHONE: data.upiPh.toUpperCase(),
      RECEIPT_FILENAME: `PAYMENT_${ans}.pdf`,
      ISSUED_BY: user,
    };
    await sheet.addRow(row);
  }
  async function onSubmit(data) {
    try {
      await setIsDownload(true);
      await setIsOpen(false);
      await setPdfData(data);
      await setError("");
      await setSuccess("");
      await addDataToSheet(data);
      setSuccess("Data added Successfully");
      reset();
      setIsOpen(true);
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <>
      <Prompt
        header="Search Expenditure"
        body={
          <ExpenditureQuery
            onClose={() => setModalOpen(false)}
            setIsOpen={setIsOpen}
            setPDFData={setPdfData}
            setSrl={setSrl}
            setIsDownload={setIsDownload}
          />
        }
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <Loading isOpen={isSubmitting} />
      <Centered>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Expenditure</h2>
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
              <Form.Group id="t" className="mb-2">
                <FloatingLabel label="Type *">
                  <Form.Select
                    disabled={isSubmitting || isOpen}
                    isInvalid={errors.type}
                    isValid={!errors.type}
                    {...register("type", {
                      required: "Income type is required",
                    })}
                    placeholder="T"
                  >
                    {fields
                      .filter((field) => field.EXPENDITURE_TYPE !== "")
                      .map((field) => (
                        <option
                          value={field.EXPENDITURE_TYPE}
                          key={field.EXPENDITURE_TYPE}
                        >
                          {field.EXPENDITURE_TYPE}
                        </option>
                      ))}
                  </Form.Select>
                </FloatingLabel>
              </Form.Group>
              <Form.Group id="date" className="mb-2">
                <FloatingLabel label="Date *">
                  <Form.Control
                    type="date"
                    disabled={isSubmitting || isOpen}
                    readOnly={isSubmitting || isOpen}
                    isInvalid={errors?.date}
                    isValid={dirtyFields?.date && !errors?.date}
                    {...register("date", {
                      required: "Date is required",
                    })}
                    placeholder="date"
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.date?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="name" className="mb-2">
                <FloatingLabel label="Name *">
                  <Form.Control
                    disabled={isSubmitting || isOpen}
                    readOnly={isSubmitting || isOpen}
                    type="text"
                    isInvalid={errors?.name}
                    isValid={dirtyFields?.name && !errors?.name}
                    {...register("name", {
                      required: "Name is required",
                    })}
                    placeholder="Name"
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.name?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="amt" className="mb-2">
                <FloatingLabel label="Ammount *">
                  <Form.Control
                    disabled={isSubmitting || isOpen}
                    readOnly={isSubmitting || isOpen}
                    type="tel"
                    isInvalid={errors?.amt}
                    isValid={dirtyFields?.amt && !errors?.amt}
                    {...register("amt", {
                      required: "Payment ammount is required",
                    })}
                    placeholder="amt"
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.amt?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="mode" className="mb-2">
                <FloatingLabel label="Mode Of Payment *">
                  <Form.Select
                    disabled={isSubmitting || isOpen}
                    {...register("mode", {
                      required: "Payment mode is required",
                    })}
                    placeholder="mode"
                    isValid={!errors?.mode}
                    isInvalid={errors?.mode}
                  >
                    {constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT.map(
                      (mode) => (
                        <option value={mode} key={mode}>
                          {mode}
                        </option>
                      )
                    )}
                  </Form.Select>
                </FloatingLabel>
              </Form.Group>
              {watchFields.mode ===
                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[0] && (
                <Form.Group id="pan" className="mb-2">
                  <FloatingLabel label="Pan number or Aadhaar card number *">
                    <Form.Control
                      disabled={isSubmitting || isOpen}
                      readOnly={isSubmitting || isOpen}
                      type="tel"
                      isInvalid={errors?.cashMode}
                      isValid={dirtyFields?.cashMode && !errors?.cashMode}
                      {...register("cashMode", {
                        required: {
                          value:
                            watchFields.mode ===
                            constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[0]
                              ? true
                              : false,
                          message:
                            "Pan number or Aadhar card number is required",
                        },
                      })}
                      placeholder="cashMode"
                    />
                    <Form.Text className="text-danger">
                      {errors?.cashMode?.message}
                    </Form.Text>
                  </FloatingLabel>
                </Form.Group>
              )}
              {watchFields.mode ===
                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[1] ||
              watchFields.mode ===
                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[2] ||
              watchFields.mode ===
                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[4] ? (
                <Form.Group id="chqno" className="mb-2">
                  <FloatingLabel
                    disabled={isSubmitting}
                    readOnly={isSubmitting}
                    label={`${
                      watchFields.mode ===
                      constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[1]
                        ? "Cheque No"
                        : watchFields.mode ===
                          constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[4]
                        ? "Transfer ID"
                        : "DD No"
                    } *`}
                  >
                    <Form.Control
                      type="tel"
                      disabled={isSubmitting || isOpen}
                      readOnly={isSubmitting || isOpen}
                      isInvalid={errors?.chequeNo}
                      isValid={dirtyFields?.chequeNo && !errors?.chequeNo}
                      {...register("chequeNo", {
                        required: {
                          value:
                            watchFields.mode ===
                              constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[1] ||
                            watchFields.mode ===
                              constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[2] ||
                            watchFields.mode ===
                              constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[4]
                              ? true
                              : false,
                          message: `${
                            watchFields.mode ===
                            constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[1]
                              ? "Cheque no is required"
                              : watchFields.mode ===
                                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[4]
                              ? "Transfer ID is required"
                              : "DD no is required"
                          }`,
                        },
                      })}
                      placeholder="chequeNo"
                    />
                    <Form.Text className="text-danger">
                      {errors?.chequeNo?.message}
                    </Form.Text>
                  </FloatingLabel>
                </Form.Group>
              ) : null}
              {watchFields.mode ===
                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[1] ||
              watchFields.mode ===
                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[2] ||
              watchFields.mode ===
                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[4] ? (
                <Form.Group id="chqdate" className="mb-2">
                  <FloatingLabel
                    label={`${
                      watchFields.mode ===
                      constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[1]
                        ? "Issue date of cheque"
                        : watchFields.mode ===
                          constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[4]
                        ? "Transfer Date"
                        : "Issue date of DD"
                    } *`}
                  >
                    <Form.Control
                      disabled={isSubmitting || isOpen}
                      readOnly={isSubmitting || isOpen}
                      type="date"
                      isInvalid={errors?.chequeDate}
                      isValid={dirtyFields?.chequeDate && !errors?.chequeDate}
                      {...register("chequeDate", {
                        required: {
                          value:
                            watchFields.mode ===
                              constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[1] ||
                            watchFields.mode ===
                              constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[2] ||
                            watchFields.mode ===
                              constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[4]
                              ? true
                              : false,
                          message: `${
                            watchFields.mode ===
                            constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[1]
                              ? "Issue date of cheque is required"
                              : watchFields.mode ===
                                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[4]
                              ? "Date of transfer is required"
                              : "Issue date of DD no is required"
                          }`,
                        },
                      })}
                      placeholder="chequeDate"
                    />
                    <Form.Text className="text-danger">
                      {errors?.chequeDate?.message}
                    </Form.Text>
                  </FloatingLabel>
                </Form.Group>
              ) : null}
              {watchFields.mode ===
                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[1] ||
              watchFields.mode ===
                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[2] ||
              watchFields.mode ===
                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[4] ? (
                <Form.Group id="chqdate" className="mb-2">
                  <FloatingLabel label="Bank name *">
                    <Form.Control
                      disabled={isSubmitting || isOpen}
                      readOnly={isSubmitting || isOpen}
                      type="text"
                      isInvalid={errors?.bank}
                      isValid={dirtyFields?.bank && !errors?.bank}
                      {...register("bank", {
                        required: {
                          value:
                            watchFields.mode ===
                              constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[1] ||
                            watchFields.mode ===
                              constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[2] ||
                            watchFields.mode ===
                              constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[4]
                              ? true
                              : false,
                          message: "Bank name is required",
                        },
                      })}
                      placeholder="chequeDate"
                    />
                    <Form.Text className="text-danger">
                      {errors?.bank?.message}
                    </Form.Text>
                  </FloatingLabel>
                </Form.Group>
              ) : null}
              {watchFields.mode ===
                constants.SELECT_OPTIONS.EXPENDITURE.PAYMENT[3] && (
                <Form.Group id="upiId" className="mb-2">
                  <FloatingLabel label="UPI Id or Mobile No.">
                    <Form.Control
                      disabled={isSubmitting || isOpen}
                      readOnly={isSubmitting || isOpen}
                      isInvalid={errors?.upiId}
                      isValid={
                        dirtyFields?.upiId &&
                        !errors?.upiId &&
                        watchFields.upiId
                      }
                      {...register("upiId", {
                        required: {
                          value: true,
                          message: `UPI ID or Mobile number is required`,
                        },
                      })}
                      placeholder="chequeDate"
                    />
                    <Form.Text className="text-danger">
                      {errors?.upiId?.message}
                    </Form.Text>
                  </FloatingLabel>
                </Form.Group>
              )}
              <Form.Group id="ph" className="mb-2">
                <FloatingLabel label="Mob no. *">
                  <Form.Control
                    type="tel"
                    disabled={isSubmitting || isOpen}
                    readOnly={isSubmitting || isOpen}
                    isInvalid={errors?.ph}
                    isValid={dirtyFields?.ph && !errors?.ph && watchFields.ph}
                    {...register("ph", {
                      required: "Mobile number is required",
                      validate: (value) =>
                        value.length === 10 ||
                        "Mobile number should have 10 digits",
                    })}
                    placeholder="Ph"
                  />
                  <Form.Text className="text-danger">
                    {errors?.ph?.message}
                  </Form.Text>
                </FloatingLabel>
              </Form.Group>
              <Form.Group id="desc" className="mb-2">
                <FloatingLabel label="Description *">
                  <Form.Control
                    disabled={isSubmitting || isOpen}
                    readOnly={isSubmitting || isOpen}
                    type="text"
                    isInvalid={errors?.desc}
                    isValid={dirtyFields?.desc && !errors?.desc}
                    {...register("desc", {
                      required: "Payment description is required",
                    })}
                    placeholder="desc"
                    as="textarea"
                  />
                </FloatingLabel>
                <Form.Text className="text-danger">
                  {errors?.desc?.message}
                </Form.Text>
              </Form.Group>
              <Form.Group id="f-submit">
                <FloatingLabel label="Bill Submmitted By">
                  <Form.Control
                    disabled={isSubmitting || isOpen}
                    readOnly={isSubmitting || isOpen}
                    type="text"
                    isInvalid={errors?.subBy}
                    isValid={dirtyFields?.subBy && !errors?.subBy}
                    placeholder="a"
                    {...register("subBy")}
                  />
                </FloatingLabel>
              </Form.Group>
              <div className="d-flex flex-row justify-content-between">
                <Button
                  type="submit"
                  disabled={isSubmitting || isOpen}
                  className="w-50 mt-2 me-2"
                >
                  Add
                </Button>
                <Button
                  onClick={() => setModalOpen(true)}
                  variant="info"
                  className="w-50 mt-2 ms-2"
                >
                  Query
                </Button>
              </div>
            </Form>
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
            id="payment-pdf-viewer"
            name="payment-pdf-viewer"
            height="56.5%"
            width="100%"
          >
            <ExpenditurePDF data={{ ...pdfData, srNo: srl }} />
          </PDFViewer>
          <PDFDownloadLink
            className="d-flex flex-row justify-content-between text-decoration-none"
            fileName={`PAYMENT_${srl}`}
            document={<ExpenditurePDF data={{ ...pdfData, srNo: srl }} />}
          >
            {({ blob, url, loading, error }) => {
              return (
                <>
                  <Button
                    disabled={loading || error}
                    variant={error ? "danger" : "outline-primary"}
                    className={isDownload ? "w-50 me-2" : "w-100"}
                    onClick={(e) => {
                      e.preventDefault();
                      window.frames["payment-pdf-viewer"].focus();
                      window.frames["payment-pdf-viewer"].print();
                    }}
                  >
                    {error ? "There was an error :-" + error.message : "Print"}
                  </Button>
                  {isDownload && (
                    <Button
                      disabled={loading || error}
                      variant={error ? "danger" : "outline-primary"}
                      className="w-50 ms-2"
                    >
                      {error ? "There was an error :-" + error.message : "Save"}
                    </Button>
                  )}
                </>
              );
            }}
          </PDFDownloadLink>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
