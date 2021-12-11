import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Centered from '../components/Centered';
import constants from '../constants';
import { useForm } from 'react-hook-form';
import Loading from '../components/Loading';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import clientCreds from '../client_creds.json';
import { useAuthProvider } from '../contexts/Auth';
import Prompt from '../components/Prompt';
import IncomeQuery from './Query/IncomeQuery';
import { useFetchMaster } from '../contexts/FetchMaster';
import receiptBill from '../templates/receipt';

export default function Income() {
	const { fields } = useFetchMaster();
	const {
		register,
		watch,
		handleSubmit,
		reset,
		formState: { errors, dirtyFields, isSubmitting },
	} = useForm({
		mode: 'all',
		defaultValues: {
			type: 'DONATION',
			desc: '',
			amt: '',
			date: '',
			name: '',
			ph: '',
			mode: 'CASH',
			cashMode: '',
			chequeNo: '',
			chequeDate: '',
			upiId: '',
			upiPh: '',
			bank: '',
		},
	});
	const { user } = useAuthProvider();
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [modalOpen, setModalOpen] = useState(false);

	const watchFields = watch();
	async function addDataToSheet(data) {
		const doc = new GoogleSpreadsheet(constants.SPREADSHEET.ID);
		await doc.useServiceAccountAuth(clientCreds);
		await doc.loadInfo();
		const sheet = doc.sheetsByIndex[0];
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
			newRowLength = Number(lastElem.SR_NO.split('-')[2]) + 1;
		}

		str = '' + newRowLength;
		const pad = '000000';
		const ans = pad.substring(0, pad.length - str.length) + str;

		const month = new Date().getMonth() + 1;
		let year, nextYear;
		if (month > 3) {
			year = new Date().getFullYear();
			nextYear = year + 1;
		}
		if (month <= 3) {
			nextYear = new Date().getFullYear();
			year = nextYear - 1;
		}
		const d = new Date(data.date);
		const dateString =
			d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
		const row = {
			SR_NO: `SV-RCPT-${ans}-${year}-${nextYear}`,
			TYPE: data.type.toUpperCase(),
			DESCRIPTION: data.desc.toUpperCase(),
			AMOUNT: data.amt,
			DATE: dateString,
			NAME: data.name.toUpperCase(),
			IDENTITY_NO: data.ph,
			MODE_OF_PAYMENT: data.mode.toUpperCase(),
			PAN_CARD_OR_AADHAR_CARD_NUMBER: data.cashMode.toUpperCase(),
			CHEQUE_OR_DD_NO: data.chequeNo.toUpperCase(),
			BANK: data.bank.toUpperCase(),
			DATE_OF_CHEQUE_OR_DD_ISSUE: data.chequeDate.toUpperCase(),
			UPI_ID: data.upiId.toUpperCase(),
			UPI_PHONE: data.upiPh,
			RECEIPT_FILENAME: `${data.type}_${ans}.pdf`,
			ISSUED_BY: user,
		};
		await sheet.addRow(row);
		const bill = await receiptBill({
			...data,
			srNo: `SV-PAY-${ans}-${year}-${nextYear}`,
		});
		const winUrl = URL.createObjectURL(new Blob([bill], { type: 'text/html' }));
		window.open(winUrl, 'win', `width=800,height=400,screenX=200,screenY=200`);
	}
	async function onSubmit(data) {
		try {
			await setError('');
			await setSuccess('');
			await addDataToSheet(data);
			setSuccess('Data added Successfully');
			reset();
		} catch (error) {
			setError(error.message);
		}
	}
	return (
		<>
			<Loading isOpen={isSubmitting} />
			<Prompt
				header='Search Receipt'
				body={
					<IncomeQuery
						onClose={() => setModalOpen(false)}
						setError={setError}
					/>
				}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
			/>
			<Centered>
				<Card>
					<Card.Body>
						<h2 className='text-center mb-4'>Income</h2>
						{error && (
							<Alert dismissible onClose={() => setError('')} variant='danger'>
								<Alert.Heading>Error</Alert.Heading>
								<p>{error}</p>
							</Alert>
						)}
						{success && (
							<Alert
								dismissible
								onClose={() => setSuccess('')}
								variant='success'
							>
								<Alert.Heading>Success</Alert.Heading>
								<p>{success}</p>
							</Alert>
						)}
						<Form noValidate onSubmit={handleSubmit(onSubmit)}>
							<Form.Group id='t' className='mb-2'>
								<FloatingLabel label='Type *'>
									<Form.Select
										isInvalid={errors.type}
										isValid={!errors.type}
										{...register('type', {
											required: 'Income type is required',
										})}
										placeholder='T'
									>
										{fields
											.filter(field => field.INCOME_TYPE !== '')
											.map(field => (
												<option
													value={field.INCOME_TYPE}
													key={field.INCOME_TYPE}
												>
													{field.INCOME_TYPE}
												</option>
											))}
									</Form.Select>
								</FloatingLabel>
							</Form.Group>
							<Form.Group id='date' className='mb-2'>
								<FloatingLabel label='Date *'>
									<Form.Control
										type='date'
										isInvalid={errors?.date}
										isValid={dirtyFields?.date && !errors?.date}
										{...register('date', {
											required: 'Date is required',
										})}
										placeholder='date'
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.date?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='name' className='mb-2'>
								<FloatingLabel label='Name *'>
									<Form.Control
										type='text'
										isInvalid={errors?.name}
										isValid={dirtyFields?.name && !errors?.name}
										{...register('name', {
											required: 'Name is required',
										})}
										placeholder='Name'
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.name?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='amt' className='mb-2'>
								<FloatingLabel label='Ammount *'>
									<Form.Control
										type='tel'
										isInvalid={errors?.amt}
										isValid={dirtyFields?.amt && !errors?.amt}
										{...register('amt', {
											required: 'Payment ammount is required',
										})}
										placeholder='amt'
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.amt?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='mode' className='mb-2'>
								<FloatingLabel label='Mode Of Payment *'>
									<Form.Select
										{...register('mode', {
											required: 'Payment mode is required',
										})}
										placeholder='mode'
										isValid={!errors?.mode}
										isInvalid={errors?.mode}
									>
										{constants.SELECT_OPTIONS.INCOME.PAYMENT.map(mode => (
											<option value={mode} key={mode}>
												{mode}
											</option>
										))}
									</Form.Select>
								</FloatingLabel>
							</Form.Group>
							{watchFields.mode ===
								constants.SELECT_OPTIONS.INCOME.PAYMENT[0] && (
								<Form.Group id='pan' className='mb-2'>
									<FloatingLabel label='Pan number or Aadhaar card number *'>
										<Form.Control
											type='tel'
											isInvalid={errors?.cashMode}
											isValid={dirtyFields?.cashMode && !errors?.cashMode}
											{...register('cashMode', {
												required: {
													value:
														watchFields.mode ===
														constants.SELECT_OPTIONS.INCOME.PAYMENT[0]
															? true
															: false,
													message:
														'Pan number or Aadhar card number is required',
												},
											})}
											placeholder='cashMode'
										/>
										<Form.Text className='text-danger'>
											{errors?.cashMode?.message}
										</Form.Text>
									</FloatingLabel>
								</Form.Group>
							)}
							{watchFields.mode ===
								constants.SELECT_OPTIONS.INCOME.PAYMENT[1] ||
							watchFields.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[2] ||
							watchFields.mode ===
								constants.SELECT_OPTIONS.INCOME.PAYMENT[4] ? (
								<Form.Group id='chqno' className='mb-2'>
									<FloatingLabel
										label={`${
											watchFields.mode ===
											constants.SELECT_OPTIONS.INCOME.PAYMENT[1]
												? 'Cheque No'
												: watchFields.mode ===
												  constants.SELECT_OPTIONS.INCOME.PAYMENT[4]
												? 'Transfer ID'
												: 'DD No'
										} *`}
									>
										<Form.Control
											type='tel'
											isInvalid={errors?.chequeNo}
											isValid={dirtyFields?.chequeNo && !errors?.chequeNo}
											{...register('chequeNo', {
												required: {
													value:
														watchFields.mode ===
															constants.SELECT_OPTIONS.INCOME.PAYMENT[1] ||
														watchFields.mode ===
															constants.SELECT_OPTIONS.INCOME.PAYMENT[2] ||
														watchFields.mode ===
															constants.SELECT_OPTIONS.INCOME.PAYMENT[4]
															? true
															: false,
													message: `${
														watchFields.mode ===
														constants.SELECT_OPTIONS.INCOME.PAYMENT[1]
															? 'Cheque no is required'
															: watchFields.mode ===
															  constants.SELECT_OPTIONS.INCOME.PAYMENT[4]
															? 'Transfer ID is required'
															: 'DD no is required'
													}`,
												},
											})}
											placeholder='chequeNo'
										/>
										<Form.Text className='text-danger'>
											{errors?.chequeNo?.message}
										</Form.Text>
									</FloatingLabel>
								</Form.Group>
							) : null}
							{watchFields.mode ===
								constants.SELECT_OPTIONS.INCOME.PAYMENT[1] ||
							watchFields.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[2] ||
							watchFields.mode ===
								constants.SELECT_OPTIONS.INCOME.PAYMENT[4] ? (
								<Form.Group id='chqdate' className='mb-2'>
									<FloatingLabel
										label={`${
											watchFields.mode ===
											constants.SELECT_OPTIONS.INCOME.PAYMENT[1]
												? 'Issue date of cheque'
												: watchFields.mode ===
												  constants.SELECT_OPTIONS.INCOME.PAYMENT[4]
												? 'Transfer Date'
												: 'Issue date of DD'
										} *`}
									>
										<Form.Control
											type='date'
											isInvalid={errors?.chequeDate}
											isValid={dirtyFields?.chequeDate && !errors?.chequeDate}
											{...register('chequeDate', {
												required: {
													value:
														watchFields.mode ===
															constants.SELECT_OPTIONS.INCOME.PAYMENT[1] ||
														watchFields.mode ===
															constants.SELECT_OPTIONS.INCOME.PAYMENT[2] ||
														watchFields.mode ===
															constants.SELECT_OPTIONS.INCOME.PAYMENT[4]
															? true
															: false,
													message: `${
														watchFields.mode ===
														constants.SELECT_OPTIONS.INCOME.PAYMENT[1]
															? 'Issue date of cheque is required'
															: watchFields.mode ===
															  constants.SELECT_OPTIONS.INCOME.PAYMENT[4]
															? 'Date of transfer is required'
															: 'Issue date of DD no is required'
													}`,
												},
											})}
											placeholder='chequeDate'
										/>
										<Form.Text className='text-danger'>
											{errors?.chequeDate?.message}
										</Form.Text>
									</FloatingLabel>
								</Form.Group>
							) : null}
							{watchFields.mode ===
								constants.SELECT_OPTIONS.INCOME.PAYMENT[1] ||
							watchFields.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[2] ||
							watchFields.mode ===
								constants.SELECT_OPTIONS.INCOME.PAYMENT[4] ? (
								<Form.Group id='chqdate' className='mb-2'>
									<FloatingLabel label='Bank name *'>
										<Form.Control
											type='text'
											isInvalid={errors?.bank}
											isValid={dirtyFields?.bank && !errors?.bank}
											{...register('bank', {
												required: {
													value:
														watchFields.mode ===
															constants.SELECT_OPTIONS.INCOME.PAYMENT[1] ||
														watchFields.mode ===
															constants.SELECT_OPTIONS.INCOME.PAYMENT[2] ||
														watchFields.mode ===
															constants.SELECT_OPTIONS.INCOME.PAYMENT[4]
															? true
															: false,
													message: 'Bank name is required',
												},
											})}
											placeholder='chequeDate'
										/>
										<Form.Text className='text-danger'>
											{errors?.bank?.message}
										</Form.Text>
									</FloatingLabel>
								</Form.Group>
							) : null}
							{watchFields.mode ===
								constants.SELECT_OPTIONS.INCOME.PAYMENT[3] && (
								<Form.Group id='upiId' className='mb-2'>
									<FloatingLabel label='UPI Id or Mobile No.'>
										<Form.Control
											isInvalid={errors?.upiId}
											isValid={
												dirtyFields?.upiId &&
												!errors?.upiId &&
												watchFields.upiId
											}
											{...register('upiId', {
												required: {
													value: true,
													message: `UPI ID or Mobile number is required`,
												},
											})}
											placeholder='chequeDate'
										/>
										<Form.Text className='text-danger'>
											{errors?.upiId?.message}
										</Form.Text>
									</FloatingLabel>
								</Form.Group>
							)}
							<Form.Group id='ph' className='mb-2'>
								<FloatingLabel label='Mob no./Reg. Id (For Students)'>
									<Form.Control
										type='text'
										isInvalid={errors?.ph}
										isValid={dirtyFields?.ph && !errors?.ph && watchFields.ph}
										{...register('ph', {
											required: 'Identity number is required',
										})}
										placeholder='Ph'
									/>
									<Form.Text className='text-danger'>
										{errors?.ph?.message}
									</Form.Text>
								</FloatingLabel>
							</Form.Group>
							<Form.Group id='desc' className='mb-2'>
								<FloatingLabel label='Description *'>
									<Form.Control
										type='text'
										isInvalid={errors?.desc}
										isValid={dirtyFields?.desc && !errors?.desc}
										{...register('desc', {
											required: 'Payment description is required',
										})}
										placeholder='desc'
										as='textarea'
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.desc?.message}
								</Form.Text>
							</Form.Group>
							<div className='d-flex flex-row justify-content-between'>
								<Button type='submit' className='w-50 mt-2 me-2'>
									Add
								</Button>
								<Button
									onClick={() => setModalOpen(true)}
									variant='info'
									className='w-50 mt-2 ms-2'
								>
									Query
								</Button>
							</div>
						</Form>
					</Card.Body>
				</Card>
			</Centered>
		</>
	);
}
