import { useCallback, useEffect, useState } from 'react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import clientCreds from '../../client_creds.json';
import constants from '../../constants';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { getDoc } from 'firebase/firestore/lite';
import { database } from '../../firebase';
import paymentBill from '../../templates/payment';

export default function ApproveQuery({
	onClose,
	setDocsModal,
	setError,
	setDocs,
	setExpID,
}) {
	const [data, setData] = useState([]);
	const [showTable, setShowTable] = useState(false);
	const fetchData = useCallback(async () => {
		try {
			setShowTable(false);
			const doc = new GoogleSpreadsheet(constants.SPREADSHEET.ID);
			await doc.useServiceAccountAuth(clientCreds);
			await doc.loadInfo();
			const sheet = doc.sheetsByIndex[1];
			const rows = await sheet.getRows();
			setData(rows.filter(row => row.STATUS === constants.EXP_STATS.PEN));
			setShowTable(true);
		} catch (error) {
			setError(error.message);
			onClose();
		}
	}, [setError, onClose]);
	useEffect(() => {
		fetchData();
		return () => {
			setData([]);
			setShowTable(false);
		};
	}, [fetchData]);
	async function onView(data) {
		const bill = await paymentBill({
			type: data.TYPE,
			desc: data.DESCRIPTION,
			amt: data.AMOUNT,
			date: data.DATE,
			name: data.NAME,
			ph: data.MOBILE_NUMBER,
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

	async function approveBill(_doc) {
		try {
			_doc.STATUS = constants.EXP_STATS.APP;
			await _doc.save();
			setData(data.filter(row => row.SR_NO !== _doc.SR_NO));
		} catch (error) {
			setError(error.message);
		}
	}

	async function showDocsModal(_id) {
		try {
			const doc = await getDoc(database.docs(_id));
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
							<th>Type</th>
							<th>Date</th>
							<th>Name</th>
							<th>Ammount</th>
							<th>Mode of payment</th>
							<th>Description</th>
							<th>Status</th>
							<th>Action</th>
							<th>Add Supporting Docs</th>
							<th>Approve</th>
						</tr>
					</thead>
					<tbody>
						{data.map(d => (
							<tr key={d.SR_NO}>
								<td>{d.TYPE}</td>
								<td>{d.DATE}</td>
								<td>{d.NAME}</td>
								<td>{d.AMOUNT}</td>
								<td>{d.MODE_OF_PAYMENT}</td>
								<td>{d.DESCRIPTION}</td>
								<td>{d.STATUS}</td>
								<td>
									<Button className='w-100' onClick={() => onView(d)}>
										View
									</Button>
								</td>
								<td>
									<Button
										className='w-100'
										onClick={() => showDocsModal(d.SR_NO)}
									>
										Docs
									</Button>
								</td>
								<td>
									<Button className='w-100' onClick={() => approveBill(d)}>
										Approve
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
