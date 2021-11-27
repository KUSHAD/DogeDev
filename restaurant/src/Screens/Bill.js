import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import constants from '../constants';
import clientCreds from '../client_creds.json';
import Loading from '../Components/Loading';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { database } from '../firebase';
import { useParams } from 'react-router-dom';
import billRecpt from '../Templates/bill';
import { updateDoc } from 'firebase/firestore';

export default function Bill({ table, onClose }) {
	const [error, setError] = useState('');
	const { id } = useParams();
	const {
		handleSubmit,
		watch,
		register,
		reset,
		formState: { dirtyFields, errors, isSubmitting },
	} = useForm({
		mode: 'all',
		defaultValues: {
			name: '',
			address: '',
			contact: '',
			wa: '',
			mode: 'CASH',
			upi: '',
		},
	});
	const watchCashMode = watch('mode');

	let TEST_STRING = '';

	async function addToSpreadsheet(data) {
		const doc = new GoogleSpreadsheet(constants.SPREAD_SHEET.ID);
		await doc.useServiceAccountAuth(clientCreds);
		await doc.loadInfo();
		const sheet = doc.sheetsByIndex[1];
		const rows = await sheet.getRows({
			offset: 0,
		});
		let lastElem = 0;
		let str = '';
		let newRowLength = '';
		if (rows.length === 0) {
			newRowLength = 1;
		} else {
			lastElem = rows[rows.length - 1];
			newRowLength = Number(lastElem.BILL_NO.split('-')[2]) + 1;
		}

		str = '' + newRowLength;

		const pad = '000000';
		const ans = pad.substring(0, pad.length - str.length) + str;

		const month = new Date().getMonth() + 1;
		let year, nextYear;
		if (month > 3) {
			year = new Date().getFullYear();
			nextYear = year + 1;
			TEST_STRING = `REST-BILL-${ans}-${year}-${nextYear}`;
		}
		if (month <= 3) {
			nextYear = new Date().getFullYear();
			year = nextYear - 1;
			TEST_STRING = `REST-BILL-${ans}-${year}-${nextYear}`;
		}
		let rowsToAdd = [];
		data.orders.forEach(async table => {
			const d = new Date();
			const dateString =
				d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();

			const row = {
				BILL_NO: `REST-BILL-${ans}-${year}-${nextYear}`,
				DATE: dateString,
				NAME: data?.data?.name.toUpperCase(),
				ADDRESS: data?.data?.address.toUpperCase(),
				CONTACT_NO: data?.data?.contact,
				WA_NO: data?.data?.wa,
				MODE: data?.data?.mode?.toUpperCase(),
				UPI_NO: data?.upi?.toUpperCase(),
				CATEGORY: table?.category,
				ITEM: table?.item?.toUpperCase(),
				PARCEL: table?.isParcel,
				QUANTITY: table?.quantity,
				TOTAL: table.quantity * table.unitPrice,
				WAITER_NO: data?.userId?.toUpperCase(),
			};
			rowsToAdd.push(row);
		});

		await sheet.addRows(rowsToAdd);
	}

	async function onSubmit(data) {
		try {
			await addToSpreadsheet({ ...table, data });
			const d = new Date();
			const dateString =
				d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();

			await updateDoc(database.orderID(id), {
				data,
				status: constants.TABLE_STATUS.BILLED,
				billedOn: dateString,
				billNo: TEST_STRING,
			});
			const a = await billRecpt(table);
			const winUrl = URL.createObjectURL(new Blob([a], { type: 'text/html' }));

			window.open(
				winUrl,
				'win',
				`width=800,height=400,screenX=200,screenY=200`
			);
			onClose();
			reset();
		} catch (error) {
			setError(error.message);
		}
	}
	return (
		<>
			<Loading isOpen={isSubmitting} />
			{error && (
				<Alert variant='danger' dismissible onClose={() => setError('')}>
					<Alert.Heading>Error</Alert.Heading>
					<p>{error}</p>
				</Alert>
			)}
			<Form noValidate onSubmit={handleSubmit(onSubmit)}>
				<Form.Group className='mb-2'>
					<FloatingLabel label='Name *'>
						<Form.Control
							isInvalid={errors?.name}
							isValid={dirtyFields?.name && !errors?.name}
							placeholder='d'
							{...register('name', {
								required: 'Name is required',
							})}
						/>
					</FloatingLabel>
					<Form.Text className='text-danger'>{errors?.name?.message}</Form.Text>
				</Form.Group>
				<Form.Group className='mb-2'>
					<FloatingLabel label='Short Address *'>
						<Form.Control
							isInvalid={errors?.address}
							isValid={dirtyFields?.address && !errors?.address}
							placeholder='d'
							{...register('address', {
								required: 'Address is required',
							})}
						/>
					</FloatingLabel>
					<Form.Text className='text-danger'>
						{errors?.address?.message}
					</Form.Text>
				</Form.Group>
				<Form.Group className='mb-2'>
					<FloatingLabel label='Contact number'>
						<Form.Control
							type='tel'
							isInvalid={errors?.contact}
							isValid={dirtyFields?.contact && !errors?.contact}
							placeholder='d'
							{...register('contact', {
								required: 'Mobile Number is required',
								validate: value => {
									if (value && value.length !== 10)
										return 'Mobile number should have 10 digits';
								},
							})}
						/>
					</FloatingLabel>
					<Form.Text className='text-danger'>
						{errors?.contact?.message}
					</Form.Text>
				</Form.Group>

				<Form.Group className='mb-2'>
					<FloatingLabel label='Whatsapp number'>
						<Form.Control
							type='tel'
							isInvalid={errors?.wa}
							isValid={dirtyFields?.wa && !errors?.wa}
							placeholder='d'
							{...register('wa', {
								validate: value => {
									if (value && value.length !== 10)
										return 'Whatsapp number should have 10 digits';
								},
							})}
						/>
					</FloatingLabel>
					<Form.Text className='text-danger'>{errors?.wa?.message}</Form.Text>
				</Form.Group>
				<Form.Group className='mb-2'>
					<FloatingLabel label='Mode of payment *'>
						<Form.Select
							isInvalid={errors.mode}
							isValid={!errors.mode}
							{...register('mode', { required: 'Mode of payment is required' })}
						>
							<option value='CASH'>Cash</option>
							<option value='UPI'>UPI</option>
						</Form.Select>
					</FloatingLabel>
					<Form.Text className='text-danger'>{errors?.mode?.message}</Form.Text>
				</Form.Group>
				{watchCashMode === 'UPI' && (
					<Form.Group className='mb-2'>
						<FloatingLabel label='UPI number'>
							<Form.Control
								isInvalid={errors?.upi}
								isValid={dirtyFields?.upi && !errors?.upi}
								placeholder='d'
								type='text'
								{...register('upi', {
									required: {
										value: watchCashMode === 'UPI' ? true : false,
										message: 'Upi number is required',
									},
								})}
							/>
						</FloatingLabel>
						<Form.Text className='text-danger'>
							{errors?.upi?.message}
						</Form.Text>
					</Form.Group>
				)}
				<Button type='submit' disabled={isSubmitting} className='w-100 mt-2'>
					Bill
				</Button>
			</Form>
		</>
	);
}
