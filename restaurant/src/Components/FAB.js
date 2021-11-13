import { createPortal } from 'react-dom';
import Button from 'react-bootstrap/Button';
export default function FAB({ icon, text, onClick }) {
	return createPortal(
		<Button
			className='shadow-lg rounded-pill position-fixed'
			onClick={onClick}
			style={{ bottom: 10, right: 10, zIndex: 30 }}
		>
			{text} {icon}
		</Button>,
		document.getElementById('fab-root')
	);
}
