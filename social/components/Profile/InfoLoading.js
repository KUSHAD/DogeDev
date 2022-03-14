export default function InfoLoading() {
	return (
		<>
			<div className='animate-pulse select-none flex flex-col md:flex-row w-full md:max-w-lg justify-between m-auto'>
				<div className='rounded-full bg-gray-400 h-[150px] w-[150px]' />
				<div className='mt-2 w-full md:max-w-xs'>
					<div>
						<div className='h-6 bg-gray-400 rounded my-2' />
					</div>
					<div className='flex flex-row justify-between mb-2'>
						<div className='mr-2 h-[18px] w-1/3 bg-gray-400' />
						<div className='mr-2 h-[18px] w-1/3 bg-gray-400' />
					</div>
					<div>
						<p className='h-[18px] bg-gray-400 rounded' />
						<p className='h-[14px] bg-gray-400 rounded ' />
						<p className='h-[14px] bg-gray-400 rounded ' />
						<p className='h-[14px] bg-gray-400 rounded ' />
					</div>

					<div className='w-full bg-blue-400 rounded py-2 text-white text-center'>
						Loading...
					</div>
				</div>
			</div>
		</>
	);
}
