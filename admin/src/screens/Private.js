import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Income from "./Income";
import Expenditure from "./Expenditure";
import Admission from "./Admission";
import Attendance from "./Attendance";

export default function Private() {
  return (
    <Tabs
      className="mt-2 mb-2 d-flex justify-content-center"
      defaultActiveKey="Inc"
    >
      <Tab eventKey="Inc" title="Income">
        <Income />
      </Tab>
      <Tab eventKey="Exp" title="Expenditure">
        <Expenditure />
      </Tab>
      <Tab eventKey="Adm" title="Admission">
        <Admission />
      </Tab>
      <Tab eventKey="Att" title="Attendance">
        <Attendance />
      </Tab>
    </Tabs>
  );
}
