export default function Centered({ children }) {
	return (
		<div className='flex h-screen justify-center items-center'>
			<div className='max-w-sm w-full'>{children}</div>
		</div>
	);
}
