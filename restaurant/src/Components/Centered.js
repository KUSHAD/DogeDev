import Container from 'react-bootstrap/Container';
export default function Centered({ children }) {
	return (
		<Container
			className='d-flex align-items-center justify-content-center'
			style={{ minHeight: '100vh' }}
		>
			<div className='w-100' style={{ maxWidth: '400px' }}>
				{children}
			</div>
		</Container>
	);
}
