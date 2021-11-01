import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

export default function Header() {
  return (
    <Navbar bg="white" sticky="top" variant="light">
      <Container>
        <Navbar.Brand className="mt-2">Sports Village Admin App</Navbar.Brand>
        <img
          src="/logo192.png"
          alt="Logo"
          style={{
            height: 64,
            width: 64,
          }}
          className="d-inline-block align-top"
        />
      </Container>
    </Navbar>
  );
}
