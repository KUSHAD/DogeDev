import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { database } from '../../firebase';
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import billRecpt from '../../Templates/bill';
import { onSnapshot, query, where } from 'firebase/firestore';
export default function BilQuery({ onClose }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, dirtyFields, isSubmitting },
	} = useForm({
		mode: 'all',
		defaultValues: {
			contact: '',
		},
	});
	const [showTable, setShowTable] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [error, setError] = useState('');
	async function onSubmit(data) {
		setShowTable(false);
		const q = query(
			database.orderColl(),
			where('data.contact', '==', data.contact)
		);

		onSnapshot(
			q,
			({ docs }) => {
				setTableData(
					docs.map(doc => {
						return {
							...doc.data(),
							id: doc.id,
						};
					})
				);
				reset();
				setShowTable(true);
			},
			err => setError(err.message)
		);
	}

	async function onPrint(data) {
		const a = await billRecpt(data);
		const winUrl = URL.createObjectURL(new Blob([a], { type: 'text/html' }));

		window.open(winUrl, 'win', `width=800,height=400,screenX=200,screenY=200`);

		onClose();
	}

	return (
		<>
			{error && (
				<Alert dismissible variant='danger' onClose={() => setError('')}>
					<Alert.Heading>Error</Alert.Heading>
					<p>{error}</p>
				</Alert>
			)}
			<Form noValidate onSubmit={handleSubmit(onSubmit)}>
				<Form.FloatingLabel label='Mobile Number'>
					<Form.Control
						readOnly={isSubmitting}
						type='tel'
						isInvalid={errors?.contact}
						isValid={dirtyFields?.contact && !errors?.contact}
						{...register('contact', {
							required: 'Mobile Number is Required',
							validate: value =>
								value.length === 10 || 'Mobile number should have 10 digits',
						})}
						placeholder='j'
					/>
				</Form.FloatingLabel>
				<Form.Text className='text-danger'>
					{errors?.contact?.message}
				</Form.Text>
				<Button disabled={isSubmitting} type='submit' className='w-100 mt-2'>
					Query
				</Button>
			</Form>
			{showTable && (
				<Table
					striped
					bordered
					hover
					responsive
					variant='dark'
					className='mt-2'
				>
					<thead>
						<tr>
							<th>Mobile Number</th>
							<th>Date</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{tableData.map(table => (
							<tr key={table.id}>
								<td>{table.data.contact}</td>
								<td>{table.billedOn}</td>
								<td>
									<Button onClick={() => onPrint(table)} className='w-100'>
										Print
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
}
