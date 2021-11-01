import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Income from "./Income";
import Expenditure from "./Expenditure";
import Admission from "./Admission";

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
      <Tab eventKey="Ad" title="Admission">
        <Admission />
      </Tab>
    </Tabs>
  );
}
