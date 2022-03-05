import { Card, Form, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateDefaultProfile } from '../../../redux/actions/profile.action';
import { NameInput, StoryInput, UsernameInput } from '../../FormControls';

export default function Profile() {
	const { auth, loading } = useSelector(state => state);
	const dispatch = useDispatch();
	function onFinish(data) {
		dispatch(updateDefaultProfile({ data, auth }));
	}
	return (
		<Card>
			<Form
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				onFinish={onFinish}
				initialValues={{
					username: auth.user.username,
					name: auth.user.name,
					story: auth.user.story,
				}}
			>
				<NameInput />
				<UsernameInput />
				<StoryInput />
				<Button
					loading={loading}
					className='w-full'
					htmlType='submit'
					type='primary'
				>
					Update Default Profile
				</Button>
			</Form>
		</Card>
	);
}
