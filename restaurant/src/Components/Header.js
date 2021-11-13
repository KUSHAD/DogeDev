import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function Header({ to, title, isBack }) {
	return (
		<div
			className='position-sticky'
			style={{
				height: 64,
				top: 0,
				left: 0,
				zIndex: 30,
			}}
		>
			<div className='bg-primary h-100 shadow-lg d-flex align-items-center'>
				<div className='d-flex flex-row ms-4'>
					{isBack && (
						<Link className='me-2 btn btn-primary' to={to}>
							<MdArrowBack />
						</Link>
					)}
					<h2 className='text-light'>{title}</h2>
				</div>
			</div>
		</div>
	);
}
