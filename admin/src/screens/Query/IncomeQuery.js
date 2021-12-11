import { useCallback, useEffect, useState } from 'react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import clientCreds from '../../client_creds.json';
import constants from '../../constants';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import receiptBill from '../../templates/receipt';
import { useAuthProvider } from '../../contexts/Auth';

export default function IncomeQuery({ onClose, setError }) {
	const { user } = useAuthProvider();
	const [name, setName] = useState('');
	const [ph, setPh] = useState('');
	const [data, setData] = useState([]);
	const [showTable, setShowTable] = useState(false);
	const [filteredData, setFilteredData] = useState([]);
	const fetchData = useCallback(async () => {
		try {
			const doc = new GoogleSpreadsheet(constants.SPREADSHEET.ID);
			await doc.useServiceAccountAuth(clientCreds);
			await doc.loadInfo();
			const sheet = doc.sheetsByIndex[0];
			const rows = await sheet.getRows();
			setData(rows);
		} catch (error) {
			setError(error.message);
			onClose();
		}
	}, [onClose, setError]);
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
				d =>
					d.NAME.includes(name) &&
					d.IDENTITY_NO.includes(ph) &&
					d.ISSUED_BY === user
			);
		}
		if (!name && ph) {
			newData = data.filter(
				d => d.IDENTITY_NO.includes(ph) && d.ISSUED_BY === user
			);
		}
		if (name && !ph) {
			newData = data.filter(d => d.NAME.includes(name) && d.ISSUED_BY === user);
		}
		setFilteredData(newData);
		setShowTable(true);
	}
	function onClear() {
		setName('');
		setPh('');
		setShowTable(false);
	}
	async function onView(data) {
		const bill = await receiptBill({
			type: data.TYPE,
			desc: data.DESCRIPTION,
			amt: data.AMOUNT,
			date: data.DATE,
			name: data.NAME,
			ph: data.IDENTITY_NO,
			mode: data.MODE_OF_PAYMENT,
			cashMode: data.PAN_CARD_OR_AADHAR_CARD_NUMBER,
			chequeNo: data.CHEQUE_OR_DD_NO,
			chequeDate: data.DATE_OF_CHEQUE_OR_DD_ISSUE,
			upiId: data.UPI_ID,
			bank: data.BANK,
			srNo: data.SR_NO,
		});
		const winUrl = URL.createObjectURL(new Blob([bill], { type: 'text/html' }));
		window.open(winUrl, 'win', `width=800,height=400,screenX=200,screenY=200`);
		onClose();
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
				<FloatingLabel label='Mobile Number or Registration Number'>
					<Form.Control
						readOnly={showTable}
						value={ph}
						onChange={e => setPh(e.target.value.toUpperCase())}
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
					variant='dark'
					className='mt-2'
					responsive
				>
					<thead>
						<tr>
							<th>Type</th>
							<th>Date</th>
							<th>Name</th>
							<th>Ammount</th>
							<th>Mode of payment</th>
							<th>Description</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{filteredData.map(d => (
							<tr key={d.SR_NO}>
								<td>{d.TYPE}</td>
								<td>{d.DATE}</td>
								<td>{d.NAME}</td>
								<td>{d.AMOUNT}</td>
								<td>{d.MODE_OF_PAYMENT}</td>
								<td>{d.DESCRIPTION}</td>
								<td>
									<Button className='w-100' onClick={() => onView(d)}>
										View
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
