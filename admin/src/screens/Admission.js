import Centered from '../components/Centered';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useForm } from 'react-hook-form';
import constants from '../constants';
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Loading from '../components/Loading';
import { useAuthProvider } from '../contexts/Auth';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import clientCreds from '../client_creds.json';
import Prompt from '../components/Prompt';
import StudentQuery from './Query/StudentQuery';
import { useFetchMaster } from '../contexts/FetchMaster';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { toBase64 } from '../toBase64';
import DeleteDocModal from './Query/DeleteDocModal';

import { getDownloadURL, ref, uploadString } from 'firebase/storage';

import { database, firebaseStorage } from '../firebase';

import { getDoc, setDoc, updateDoc } from 'firebase/firestore/lite';

import { MdOpenInNew, MdDelete } from 'react-icons/md';

export default function Admission() {
	const { fields, setStudentsAdd, studentsAdd } = useFetchMaster();
	const {
		register,
		reset,
		handleSubmit,
		setValue,
		formState: { errors, dirtyFields, isSubmitting },
	} = useForm({
		mode: 'all',
		defaultValues: {
			doa: '',
			name: '',
			sex: 'MALE',
			blood: 'NOT KNOWN',
			dob: '',
			sub: 'MEMBER',
			ed: '',
			tel: '',
			mother: '',
			father: '',
			address: '',
			email: '',
			wa: '',
			aadhar: '',
			pan: '',
		},
	});
	const [deleteDocModal, setDeleteDocModal] = useState(false);
	const [deleteDoc, setDeleteDoc] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const { user } = useAuthProvider();
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [fileName, setFileName] = useState('');
	const [docs, setDocs] = useState([]);
	const [isDisabled, setIsDisabled] = useState(false);
	const [newFile, setNewFile] = useState('');
	const [expID, setExpID] = useState('');
	const [isUpdating, setIsUpdating] = useState(false);
	const [updatingRow, setUpdatingRow] = useState('');

	async function addDataToSheet(data) {
		const doc = new GoogleSpreadsheet(constants.SPREADSHEET.ID);
		await doc.useServiceAccountAuth(clientCreds);
		await doc.loadInfo();
		const sheet = doc.sheetsByIndex[2];
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
			newRowLength =
				Number(lastElem.SR.split('-')[1].replace('MEMBER', '')) + 1;
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
		const d = new Date(data.dob);
		const dateString =
			d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
		const doa = new Date(data.doa);
		const doaDateString =
			doa.getMonth() + 1 + '/' + doa.getDate() + '/' + doa.getFullYear();
		let sr;
		sr = `SV-MEMBER${ans}-${year}-${nextYear}`.toUpperCase();
		const row = {
			SR: sr,
			NAME: data.name.toUpperCase(),
			DATE_OF_ADMISSION: doaDateString,
			BLOOD_GROUP: data.blood.toUpperCase(),
			DOB: dateString,
			SUBJECT: data.sub.toUpperCase(),
			EDUCATION: data.ed.toUpperCase(),
			CONTACT: data.tel.toUpperCase(),
			MOTHER: data.mother.toUpperCase(),
			FATHER: data.father.toUpperCase(),
			ADDRESS: data.address.toUpperCase(),
			EMAIL: data.email.toUpperCase(),
			WHATSAPP: data.wa,
			AADHAR_CARD: data.aadhar,
			PAN_CARD: data.pan,
			ISSUED_BY: user,
			GENDER: data.sex,
		};
		await sheet.addRow(row);
		setStudentsAdd([row, ...studentsAdd]);
		setExpID(sr);
		setNewFile('');
		setFileName('');
		setDocs([]);
		setSuccess(`Data added Successfully! Registration ID :-  ${sr}`);
	}
	async function onSubmit(data) {
		try {
			await setError('');
			await setSuccess('');
			await addDataToSheet(data);
			setIsOpen(true);
			reset();
		} catch (error) {
			setError(error.message);
		}
	}

	async function handleFileChange(e) {
		try {
			setError('');
			setSuccess('');
			const file = e.target.files[0];

			if (!file) return;

			if (file.size > 1024 * 1024 * 2)
				return setError('File size should be maximum 2mb');

			if (file.type !== 'image/jpeg' && file.type !== 'image/png')
				return setError('Please upload a .jpeg or .jpg or .png  file');

			setFileName(file.name);

			toBase64(file)
				.then(res => {
					setNewFile(res);
				})
				.catch(error => {
					setError(error.message);
				});
		} catch (error) {
			setError(error.message);
		}
	}

	async function onUploadFile() {
		try {
			setError('');
			setIsDisabled(true);
			const storageRef = ref(
				firebaseStorage,
				`admin-admission-docs/${fileName}`
			);
			const uploadTask = await uploadString(storageRef, newFile, 'data_url');
			const fileURL = await getDownloadURL(uploadTask.ref);
			const doc = await getDoc(database.addDoc(expID));
			if (doc.exists()) {
				updateDoc(database.addDoc(expID), {
					files: [...doc.data().files, fileURL],
				});
				setDocs([...doc.data().files, fileURL]);
			} else {
				setDoc(database.addDoc(expID), {
					files: [fileURL],
				});
				setDocs([fileURL]);
			}
			setFileName('');
			setNewFile('');
		} catch (err) {
			setError(err.message);
		} finally {
			setIsDisabled(false);
		}
	}

	async function updateUser(data) {
		try {
			const d = new Date(data.dob);
			const dateString =
				d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
			const doa = new Date(data.doa);
			const doaDateString =
				doa.getMonth() + 1 + '/' + doa.getDate() + '/' + doa.getFullYear();
			const doc = new GoogleSpreadsheet(constants.SPREADSHEET.ID);
			await doc.useServiceAccountAuth(clientCreds);
			await doc.loadInfo();
			const sheet = doc.sheetsByIndex[2];
			const rows = await sheet.getRows({ offset: 0 });
			let row = rows.find(_row => _row.a1Range === updatingRow);
			row.NAME = data.name.toUpperCase();
			row.DATE_OF_ADMISSION = doaDateString;
			row.BLOOD_GROUP = data.blood.toUpperCase();
			row.DOB = dateString;
			row.SUBJECT = data.sub.toUpperCase();
			row.EDUCATION = data.ed.toUpperCase();
			row.CONTAC = data.tel.toUpperCase();
			row.MOTHER = data.mother.toUpperCase();
			row.FATHER = data.father.toUpperCase();
			row.ADDRESS = data.address.toUpperCase();
			row.EMAIL = data.email.toUpperCase();
			row.WHATSAPP = data.wa;
			row.AADHAR_CARD = data.aadhar;
			row.PAN_CARD = data.pan;
			row.GENDER = data.sex;
			await row.save();
			reset();
			setUpdatingRow('');
			setIsUpdating(false);
		} catch (_error) {
			setError(_error.message);
		}
	}

	return (
		<>
			<Prompt
				header='Search Members'
				body={
					<StudentQuery
						setIsUpdating={setIsUpdating}
						setFormValue={setValue}
						setDocsModal={setIsOpen}
						setExpID={setExpID}
						setDocs={setDocs}
						setError={setError}
						onClose={() => setModalOpen(false)}
						setUpdatingRow={setUpdatingRow}
					/>
				}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
			/>

			<Loading isOpen={isSubmitting || isDisabled} />
			<Centered>
				<Card>
					<Card.Body>
						<h2 className='text-center mb-2'>Registration</h2>
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
						<Form
							noValidate
							onSubmit={
								isUpdating ? handleSubmit(updateUser) : handleSubmit(onSubmit)
							}
						>
							<Form.Group id='cn' className='mb-2'>
								<FloatingLabel label='Contact No *'>
									<Form.Control
										isInvalid={errors?.tel}
										isValid={dirtyFields?.tel && !errors?.tel}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										type='tel'
										placeholder='a'
										{...register('tel', {
											required: 'Contact number is required',
											validate: value =>
												value.length === 10 ||
												'Mobile number should have 10 digits',
										})}
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.tel?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='doa' className='mb-2'>
								<FloatingLabel label='Date of Joining *'>
									<Form.Control
										isInvalid={errors?.doa}
										isValid={dirtyFields?.doa && !errors?.doa}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										{...register('doa', {
											required: 'Date of joining is required',
										})}
										type='date'
										placeholder='d'
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.doa?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='name' className='mb-2'>
								<FloatingLabel label='Name *'>
									<Form.Control
										isInvalid={errors?.name}
										isValid={dirtyFields?.name && !errors?.name}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										{...register('name', {
											required: 'Name is required',
										})}
										type='text'
										placeholder='d'
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.name?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='sex' className='mb-2'>
								<FloatingLabel label='Sex *'>
									<Form.Select
										isInvalid={errors.sex}
										isValid={!errors.sex}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										{...register('sex', {
											required: 'Sex is required',
										})}
									>
										{constants.SEX.map(sex => (
											<option value={sex} key={sex}>
												{sex}
											</option>
										))}
									</Form.Select>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.sex?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='blood-gorup' className='mb-2'>
								<FloatingLabel label='Blood Group *'>
									<Form.Select
										isInvalid={errors.blood}
										isValid={!errors.blood}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										{...register('blood', {
											required: 'Blood group is required',
										})}
									>
										{constants.BLOOD_GROUP.map(group => (
											<option value={group} key={group}>
												{group}
											</option>
										))}
									</Form.Select>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.blood?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='dob' className='mb-2'>
								<FloatingLabel label='Date of birth *'>
									<Form.Control
										isInvalid={errors?.dob}
										isValid={dirtyFields?.dob && !errors?.dob}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										type='date'
										placeholder='a'
										{...register('dob', {
											required: 'Date of birth is required',
										})}
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.dob?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='sub' className='mb-2'>
								<FloatingLabel label='Role *'>
									<Form.Select
										isInvalid={errors.sub}
										isValid={!errors.sub}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										{...register('sub', {
											required: 'Member role is required',
										})}
									>
										{fields
											.filter(field => field.ADMISSION_SUBJECTS !== undefined)
											.map(field => (
												<option
													value={field.ADMISSION_SUBJECTS}
													key={field.ADMISSION_SUBJECTS}
												>
													{field.ADMISSION_SUBJECTS}
												</option>
											))}
									</Form.Select>
									<Form.Text className='text-danger'>
										{errors?.sub?.message}
									</Form.Text>
								</FloatingLabel>
							</Form.Group>
							<Form.Group id='ed' className='mb-2'>
								<FloatingLabel label='Education Qualification *'>
									<Form.Control
										isInvalid={errors?.ed}
										isValid={dirtyFields?.ed && !errors?.ed}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										placeholder='a'
										{...register('ed', {
											required: 'Education qualification is required',
										})}
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.ed?.message}
								</Form.Text>
							</Form.Group>

							<Form.Group id='moth' className='mb-2'>
								<FloatingLabel label="Mother's Name *">
									<Form.Control
										isInvalid={errors?.mother}
										isValid={dirtyFields?.mother && !errors?.mother}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										placeholder='a'
										{...register('mother', {
											required: "Mother's name is required",
										})}
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.mother?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='fath' className='mb-2'>
								<FloatingLabel label="Father's Name *">
									<Form.Control
										isInvalid={errors?.father}
										isValid={dirtyFields?.father && !errors?.father}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										placeholder='a'
										{...register('father', {
											required: "Father's name is required",
										})}
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.father?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='add' className='mb-2'>
								<FloatingLabel label='Address *'>
									<Form.Control
										isInvalid={errors?.address}
										isValid={dirtyFields?.address && !errors?.address}
										{...register('address', {
											required: 'Address is required',
										})}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										placeholder='a'
										as='textarea'
									/>
									<Form.Text className='text-danger'>
										{errors?.address?.message}
									</Form.Text>
								</FloatingLabel>
							</Form.Group>
							<Form.Group id='mail' className='mb-2'>
								<FloatingLabel label='Email *'>
									<Form.Control
										isInvalid={errors?.email}
										isValid={dirtyFields?.email && !errors?.email}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										placeholder='a'
										type='email'
										{...register('email', {
											pattern: {
												value: constants.EMAIL_REGEX,
												message: 'Email not valid',
											},
										})}
									/>
									<Form.Text className='text-danger'>
										{errors?.email?.message}
									</Form.Text>
								</FloatingLabel>
							</Form.Group>
							<Form.Group id='wa' className='mb-2'>
								<FloatingLabel label='Whatsapp No. *'>
									<Form.Control
										isInvalid={errors?.wa}
										isValid={dirtyFields?.wa && !errors?.wa}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										placeholder='a'
										type='tel'
										{...register('wa', {
											minLength: {
												value: 10,
												message: 'Whatsapp number should have 10 digits',
											},
											maxLength: {
												value: 10,
												message: 'Whatsapp number should have 10 digits',
											},
										})}
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.wa?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='dis' className='mb-2'>
								<FloatingLabel label='Aadhar Card*'>
									<Form.Control
										type='tel'
										isInvalid={errors?.aadhar}
										isValid={dirtyFields?.aadhar && !errors?.aadhar}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										placeholder='a'
										{...register('aadhar', {
											required: 'Aadhar card is required',
											pattern: {
												value: /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/,
												message: 'Enter Valid Aadhar Card Number',
											},
										})}
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.aadhar?.message}
								</Form.Text>
							</Form.Group>
							<Form.Group id='dis' className='mb-2'>
								<FloatingLabel label='Pan Card*'>
									<Form.Control
										type='tel'
										isInvalid={errors?.pan}
										isValid={dirtyFields?.pan && !errors?.pan}
										disabled={isSubmitting}
										readOnly={isSubmitting}
										placeholder='a'
										{...register('pan', {
											required: 'Pan card is required',
											pattern: {
												value: /[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
												message: 'Enter Valid Pan Card Number',
											},
										})}
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.pan?.message}
								</Form.Text>
							</Form.Group>
							<Button
								type='submit'
								disabled={isSubmitting}
								className='w-100 mt-2'
							>
								Add
							</Button>
						</Form>
						<div className='d-flex flex-row justify-content-between'>
							<Button
								onClick={() => setModalOpen(true)}
								variant='info'
								className='w-100 mt-2 me-2'
							>
								Query
							</Button>
						</div>
						{isUpdating && (
							<Button
								variant='outline-danger'
								onClick={() => {
									reset();
									setIsUpdating(false);
								}}
								className='w-100 mt-2'
							>
								Clear
							</Button>
						)}
					</Card.Body>
				</Card>
			</Centered>
			<Offcanvas
				show={isOpen}
				backdrop={false}
				onHide={() => {
					setIsOpen(false);
					setFileName('');
					setNewFile('');
				}}
			>
				<Offcanvas.Header closeButton closeLabel='Close'>
					<Offcanvas.Title>Supporting Docs</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					{docs.map(doc => (
						<div className='d-flex flex-column' key={doc}>
							<iframe
								className='justify-content-center'
								src={doc}
								title={doc}
							/>
							<div className='d-flex flex-row'>
								<Button
									variant='outline-primary'
									className='w-50 me-2'
									onClick={() => window.open(doc)}
								>
									<MdOpenInNew /> Open in a new tab
								</Button>
								<Button
									variant='outline-danger'
									onClick={() => {
										setDeleteDoc(doc);
										setDeleteDocModal(true);
									}}
									className='w-50 ms-2'
								>
									<MdDelete />
									Delete Doc
								</Button>
							</div>
						</div>
					))}

					{newFile && (
						<>
							<Form.Label className='mt-2'>New File</Form.Label>
							<iframe
								width='100%'
								className='mb-2'
								src={newFile}
								title='newFile'
								style={{
									display: newFile ? 'block' : 'none',
								}}
							/>
						</>
					)}

					<Form.Label className='mt-2'>Add New Document</Form.Label>
					<Form.Control
						className='mb-2'
						type='file'
						accept='image/*'
						multiple={false}
						onChange={handleFileChange}
					/>
					{newFile && (
						<Button
							disabled={isDisabled}
							variant='outline-primary'
							className='w-100'
							onClick={onUploadFile}
						>
							Upload
						</Button>
					)}
				</Offcanvas.Body>
			</Offcanvas>
			<Prompt
				header='Delete Doc'
				body={
					<DeleteDocModal
						expID={expID}
						docs={docs}
						deleteDoc={deleteDoc}
						onClose={() => {
							setDeleteDoc('');
							setDeleteDocModal(false);
						}}
						setDocs={setDocs}
						setError={setError}
						setIsDisabled={setIsDisabled}
						isDisabled={isDisabled}
						isMember={true}
					/>
				}
				isOpen={deleteDocModal}
				onClose={() => {
					setDeleteDoc('');
					setDeleteDocModal(false);
				}}
			/>
		</>
	);
}
