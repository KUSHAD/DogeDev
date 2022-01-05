import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Income from './Income';
import Expenditure from './Expenditure';
import Admission from './Admission';
import Attendance from './Attendance';
import { useAuthProvider } from '../contexts/Auth';
import constants from '../constants';

export default function Private() {
	const { userPerms } = useAuthProvider();
	return (
		<Tabs
			className='mt-2 mb-2 d-flex justify-content-center'
			defaultActiveKey={
				userPerms === constants.USER_PERMS.TEST ||
				userPerms === constants.USER_PERMS.EXECUTIVE ||
				userPerms === constants.USER_PERMS.TREASURER
					? 'Inc'
					: 'Att'
			}
		>
			{userPerms === constants.USER_PERMS.TEST ||
			userPerms === constants.USER_PERMS.EXECUTIVE ||
			userPerms === constants.USER_PERMS.TREASURER ? (
				<Tab eventKey='Inc' title='Income'>
					<Income />
				</Tab>
			) : null}
			{userPerms === constants.USER_PERMS.TEST ||
			userPerms === constants.USER_PERMS.EXECUTIVE ||
			userPerms === constants.USER_PERMS.TREASURER ? (
				<Tab eventKey='Exp' title='Expenditure'>
					<Expenditure />
				</Tab>
			) : null}
			{userPerms === constants.USER_PERMS.TEST ||
			userPerms === constants.USER_PERMS.EXECUTIVE ||
			userPerms === constants.USER_PERMS.TREASURER ? (
				<Tab eventKey='Adm' title='Admission'>
					<Admission />
				</Tab>
			) : null}
			<Tab eventKey='Att' title='Attendance'>
				<Attendance />
			</Tab>
		</Tabs>
	);
}
