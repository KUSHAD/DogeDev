import { useCallback, useEffect, useState } from 'react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import clientCreds from '../../client_creds.json';
import constants from '../../constants';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import { getDoc } from 'firebase/firestore/lite';
import { database } from '../../firebase';

export default function StudentQuery({
	onClose,
	setDocsModal,
	setDocs,
	setExpID,
	setError,
}) {
	const [name, setName] = useState('');
	const [ph, setPh] = useState('');
	const [data, setData] = useState([]);
	const [showTable, setShowTable] = useState(false);
	const [filteredData, setFilteredData] = useState([]);
	const fetchData = useCallback(async () => {
		const doc = new GoogleSpreadsheet(constants.SPREADSHEET.ID);
		await doc.useServiceAccountAuth(clientCreds);
		await doc.loadInfo();
		const sheet = doc.sheetsByIndex[2];
		const rows = await sheet.getRows();
		setData(rows);
	}, []);
	useEffect(() => {
		fetchData();
		return () => {
			setData([]);
			setFilteredData([]);
			setName('');
			setPh('');
			setShowTable(false);
		};
	}, [fetchData]);
	function onOk() {
		let newData;
		if (name && ph) {
			newData = data.filter(
				d => d.NAME.includes(name) && d.CONTACT.includes(ph)
			);
		}
		if (!name && ph) {
			newData = data.filter(d => d.CONTACT.includes(ph));
		}
		if (name && !ph) {
			newData = data.filter(d => d.NAME.includes(name));
		}
		setFilteredData(newData);
		setShowTable(true);
	}
	function onClear() {
		setName('');
		setPh('');
		setShowTable(false);
	}

	async function showDocsModal(_id) {
		try {
			const doc = await getDoc(database.addDoc(_id));
			if (doc.exists()) {
				setDocs(doc.data().files);
			} else {
				setDocs([]);
			}
			setExpID(_id);
			setDocsModal(true);
		} catch (error) {
			setError(error.message);
		} finally {
			onClose();
		}
	}

	return (
		<>
			<Form.Group id='name' className='mb-2'>
				<FloatingLabel label='Name'>
					<Form.Control
						readOnly={showTable}
						value={name}
						onChange={e => setName(e.target.value.toUpperCase())}
						placeholder='d'
					/>
				</FloatingLabel>
			</Form.Group>
			<Form.Group id='ph' className='mb-2'>
				<FloatingLabel label='Mobile Number'>
					<Form.Control
						readOnly={showTable}
						value={ph}
						type='tel'
						onChange={e => setPh(e.target.value)}
						placeholder='d'
					/>
				</FloatingLabel>
			</Form.Group>
			<Button
				onClick={() => (showTable ? onClear() : onOk())}
				disabled={!showTable && !name && !ph}
				className='w-100 mt-2'
			>
				{showTable ? 'Clear' : 'OK'}
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
							<th>Registration Number</th>
							<th>Name</th>
							<th>Subject</th>
							<th>DOB</th>
							<th>Father's Name</th>
							<th>Mother's Name</th>
							<th>Add Supporting Docs</th>
						</tr>
					</thead>
					<tbody>
						{filteredData.map((d, i) => (
							<tr key={`${d.SR}-${i}`}>
								<td>{d.SR}</td>
								<td>{d.NAME}</td>
								<td>{d.SUBJECT}</td>
								<td>{d.DOB}</td>
								<td>{d.FATHER}</td>
								<td>{d.MOTHER}</td>
								<td>
									<Button className='w-100' onClick={() => showDocsModal(d.SR)}>
										Docs
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
