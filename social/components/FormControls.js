import { Input, Form, Checkbox } from 'antd';
export function NameInput() {
	return (
		<Form.Item
			label='Name'
			name='name'
			rules={[
				{
					required: true,
					message: 'Required',
				},
				{ max: 25, message: 'Maximum 25 characters' },
				{ whitespace: true, message: 'Remove whitespaces' },
			]}
		>
			<Input />
		</Form.Item>
	);
}

export function EmailInput() {
	return (
		<Form.Item
			label='Email'
			name='email'
			rules={[
				{
					required: true,
					message: 'Required',
				},
				{
					pattern:
						/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
					message: 'Enter valid email',
				},
			]}
		>
			<Input />
		</Form.Item>
	);
}

export function UsernameInput() {
	return (
		<Form.Item
			label='Username'
			name='username'
			rules={[
				{
					required: true,
					message: 'Required',
				},
				{
					pattern: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/i,
					message: 'Enter valid username',
				},
			]}
		>
			<Input />
		</Form.Item>
	);
}

export function PassInput() {
	return (
		<Form.Item
			label='Password'
			name='password'
			rules={[
				{
					required: true,
					message: 'Required',
				},
				{
					min: 6,
					message: 'Minimum 6 characters',
				},
				{
					max: 15,
					message: 'Maximum 15 characters',
				},
			]}
		>
			<Input.Password />
		</Form.Item>
	);
}

export function ConfPassInput({ _ref }) {
	return (
		<Form.Item
			label='Confirm Pass'
			name='confPass'
			rules={[
				{
					required: true,
					message: 'Required',
				},
				{
					validator: async (_, _value) => {
						const mainPass = _ref.current.getFieldValue('password');
						if (mainPass !== _value)
							return Promise.reject(`Passwords don't match`);
					},
				},
			]}
		>
			<Input.Password />
		</Form.Item>
	);
}

export function RememberMeCheckBox() {
	return (
		<Form.Item
			name='remember'
			valuePropName='checked'
			wrapperCol={{
				offset: 8,
				span: 16,
			}}
		>
			<Checkbox>Remember Me</Checkbox>
		</Form.Item>
	);
}

export function OTPInput() {
	return (
		<Form.Item
			label='OTP'
			name='otp'
			rules={[
				{
					required: true,
					message: 'Required',
				},
				{ len: 6, message: 'Should be 6 digits' },
				{
					validator: async (_, _value) => {
						if (isNaN(Number(_value)))
							return Promise.reject(`Must be a numerical value`);
					},
				},
				{
					whitespace: true,
					message: 'No whitespace to be provided',
				},
			]}
		>
			<Input />
		</Form.Item>
	);
}

export function EmailUserNameInput() {
	return (
		<Form.Item
			label='Email/username'
			name='identity'
			rules={[
				{
					required: true,
					message: 'Required',
				},
			]}
		>
			<Input />
		</Form.Item>
	);
}
