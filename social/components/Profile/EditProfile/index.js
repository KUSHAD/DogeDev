import { Modal, Tabs, Typography } from 'antd';
import Profile from './Profile';
import Avatar from './Avatar';
import Email from './Email';
import Password from './Password';
import { useSelector } from 'react-redux';

const { TabPane } = Tabs;
export default function EditProfile({ isOpen, onClose }) {
	const { loading, auth } = useSelector(state => state);
	return (
		<Modal
			footer={[]}
			title={[<Typography>Edit User Profile</Typography>]}
			centered
			visible={isOpen}
			onCancel={() => {
				if (!loading && !auth.tempEmail) return onClose();
			}}
			destroyOnClose
		>
			<Tabs defaultActiveKey='1' centered>
				<TabPane tab='Default Profile' key='1'>
					<Profile />
				</TabPane>
				<TabPane tab='Avatar' key='2'>
					<Avatar />
				</TabPane>
				<TabPane tab='Email' key='3'>
					<Email />
				</TabPane>
				<TabPane tab='Password' key='4'>
					<Password />
				</TabPane>
			</Tabs>
		</Modal>
	);
}
