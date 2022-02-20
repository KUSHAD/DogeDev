export default function Layout({ children }) {
	return (
		<div className='w-full min-h-screen bg-gray-200'>
			<div className='max-w-5xl w-full min-h-screen m-auto'>{children}</div>
		</div>
	);
}
