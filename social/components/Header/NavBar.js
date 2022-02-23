import Logo from './Logo';
import NavItems from './NavItems';
import Search from './Search';

export default function NavBar() {
	return (
		<div className='w-full bg-white sticky top-0 left-0 h-16 shadow-lg rounded-b-lg'>
			<div className='px-4 md:flex md:flex-row flex flex-col md:justify-between'>
				<Logo />
				<Search />
				<NavItems />
			</div>
		</div>
	);
}
