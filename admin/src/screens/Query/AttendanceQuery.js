import { useEffect, useCallback, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import constants from '../../constants';
import { useFetchMaster } from '../../contexts/FetchMaster';
import { database } from '../../firebase';
import { getDoc } from 'firebase/firestore/lite';
export default function AttendanceQuery() {
	const { fields, studentsAdd } = useFetchMaster();
	const [dates, setDates] = useState([]);
	const [subject, setSubject] = useState('');
	const [days, setDays] = useState([]);
	const [showTable, setShowTable] = useState(false);
	const [year, setYear] = useState('');
	const [error, setError] = useState('');
	const [month, setMonth] = useState('');
	const [studentAtt, setStudentAtt] = useState([]);
	const daysInMonth = useCallback(async () => {
		try {
			setStudentAtt([]);
			setError('');
			setShowTable(false);
			const days = new Date(Number(year), Number(month), 0).getDate();

			let datesArr = [];
			let daysArr = [];

			const dayOfWeek = new Date(Number(year), Number(month - 1), 1).getDay();

			for (let i = 1; i < days + 1; i++) {
				datesArr.push(i);
			}
			for (let i = dayOfWeek; i < days + dayOfWeek; i++) {
				daysArr.push(constants.DAYS_OF_WEEK[i][i]);
			}
			setDates(datesArr);
			setDays(daysArr);

			const studentsInSubject = studentsAdd.filter(
				student => student.SUBJECT === subject
			);

			studentsInSubject.forEach(async student => {
				try {
					const dataInDB = await getDoc(database.att(student.SR));
					let blanksArr = [];
					for (let index = 0; index < days; index++) {
						blanksArr.push(' ');
					}
					if (dataInDB.exists()) {
						if (dataInDB.data()[subject]) {
							if (dataInDB.data()[subject].length === 0) {
								setStudentAtt(prevState => [
									...prevState,
									{
										att: blanksArr,
										_id: student.SR,
										name: student.NAME,
									},
								]);
							} else {
								const filteredData = dataInDB
									.data()
									[subject].filter(
										day =>
											day.split('-')[0] === year && day.split('-')[1] === month
									);
								filteredData.map(day => {
									const i = day.split('-')[2] - 1;
									blanksArr[i] = 'P';
								});
								setStudentAtt(prevState => [
									...prevState,
									{
										att: blanksArr,
										_id: student.SR,
										name: student.NAME,
									},
								]);
							}
						} else {
							setStudentAtt(prevState => [
								...prevState,
								{
									att: blanksArr,
									_id: student.SR,
									name: student.NAME,
								},
							]);
						}
					} else {
						setStudentAtt(prevState => [
							...prevState,
							{
								att: blanksArr,
								_id: student.SR,
								name: student.NAME,
							},
						]);
					}
				} catch (error) {
					setError(`${error.message}`);
					console.error(error);
				}
			});

			setShowTable(true);
		} catch (error) {
			setError(error.message);
			console.error(error);
		}
	}, [month, year, subject, studentsAdd]);
	useEffect(() => {
		return () => {
			setDates([]);
		};
	}, []);

	return (
		<>
			{error && (
				<Alert variant='danger' dismissible onClose={() => setError('')}>
					<Alert.Heading>Error</Alert.Heading>
					<p>{error}</p>
				</Alert>
			)}
			<Form.FloatingLabel label='Month and Year'>
				<Form.Control
					className='mb-2'
					type='month'
					placeholder='s'
					onChange={({ target: { value } }) => {
						setShowTable(false);
						setYear(value.split('-')[0]);
						setMonth(value.split('-')[1]);
					}}
				/>
			</Form.FloatingLabel>

			<Form.FloatingLabel label='Subject'>
				<Form.Select
					placeholder='s'
					onChange={({ target: { value } }) => {
						setShowTable(false);
						setSubject(value);
					}}
				>
					<option value=''>--------Choose--------</option>
					{fields
						.filter(field => field.ADMISSION_SUBJECTS !== undefined)
						.map(field => (
							<option key={field.ADMISSION_SUBJECTS}>
								{field.ADMISSION_SUBJECTS}
							</option>
						))}
				</Form.Select>
			</Form.FloatingLabel>
			<Button
				disabled={!month || !year || !subject}
				className='w-100 mt-2'
				onClick={() => {
					daysInMonth();
				}}
			>
				View
			</Button>
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
							<th></th>
							<th></th>
							{days.map((d, i) => (
								<th key={i}>{d}</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr>
							<th>Name</th>
							<th>Days Present</th>
							{dates.map(d => (
								<th key={d}>{d}</th>
							))}
						</tr>
						{studentAtt.map((student, index) => (
							<tr key={`${student.SR}-${index}`}>
								<td>{student.name}</td>
								<td>{student.att.filter(day => day === 'P').length}</td>
								{student.att.map((day, index) => (
									<td key={index}>{day}</td>
								))}
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
}
