import Modal from 'react-bootstrap/Modal';

export default function Prompt({ children, isOpen, onClose, header }) {
	return (
		<Modal
			show={isOpen}
			centered
			backdrop='static'
			keyboard={false}
			onHide={onClose}
		>
			<Modal.Header closeButton>
				<Modal.Title>{header}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{children}</Modal.Body>
		</Modal>
	);
}
