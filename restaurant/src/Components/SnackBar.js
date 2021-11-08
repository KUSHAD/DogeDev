import Toast from 'react-bootstrap/Toast';
import { createPortal } from 'react-dom';

export default function SnackBar({ isOpen, onClose, error }) {
	return createPortal(
		<div className='position-fixed' style={{ bottom: 10, left: 10 }}>
			<Toast show={isOpen} onClose={onClose} bg='danger' delay={6000} autohide>
				<Toast.Header>
					<strong className='me-auto'>Error</strong>
				</Toast.Header>
				<Toast.Body>{error}</Toast.Body>
			</Toast>
		</div>,
		document.getElementById('toast-root')
	);
}
