import { Button, Card, Form } from 'antd';
import { ConfPassInput, PassInput } from '../../FormControls';
import { useSelector, useDispatch } from 'react-redux';
import { updatePass } from '../../../redux/actions/profile.action';

export default function Password() {
	const { useForm } = Form;
	const formRef = useForm();
	const { loading, auth } = useSelector(state => state);
	const dispatch = useDispatch();

	function onFinish(data) {
		dispatch(updatePass(data, auth, formRef));
	}

	return (
		<Card>
			<Form
				onFinish={onFinish}
				ref={formRef}
				name='passForm'
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				initialValues={{
					currentPass: '',
					password: '',
					confPass: '',
				}}
			>
				<PassInput label='Current Password' name='currentPass' />
				<PassInput label='New Password' />
				<ConfPassInput label='Confirm New Pass' _ref={formRef} />
				<Button
					loading={loading}
					type='primary'
					className='w-full'
					htmlType='submit'
				>
					Update Pass
				</Button>
			</Form>
		</Card>
	);
}
