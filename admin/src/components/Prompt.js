import Modal from "react-bootstrap/Modal";
export default function Prompt({ header, isOpen, body, onClose }) {
  return (
    <Modal
      centered
      show={isOpen}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton closeLabel="Close">
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
    </Modal>
  );
}
