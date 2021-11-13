import Toast from 'react-bootstrap/Toast';
import { createPortal } from 'react-dom';

export default function SnackBar({ isOpen, onClose, message, variant }) {
	return createPortal(
		<div
			className='position-fixed'
			style={{ bottom: 10, left: 10, zIndex: 30 }}
		>
			<Toast
				show={isOpen}
				onClose={onClose}
				bg={variant ? variant : 'danger'}
				delay={6000}
				autohide
			>
				<Toast.Header>
					<strong className='me-auto'>
						{variant === 'danger' ? 'ERROR' : variant?.toUpperCase()}
					</strong>
				</Toast.Header>
				<Toast.Body>{message}</Toast.Body>
			</Toast>
		</div>,
		document.getElementById('toast-root')
	);
}
