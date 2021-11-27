import { useParams } from 'react-router-dom';
import Header from '../Components/Header';
import { onSnapshot, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { database } from '../firebase';
import SnackBar from '../Components/SnackBar';
import { useFetchMaster } from '../context/FetchMaster';
import Prompt from '../Components/Prompt';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BSTable from 'react-bootstrap/Table';
import kitchenRecpt from '../Templates/kitchen';
import billRecpt from '../Templates/bill';
import constants from '../constants';
import intFormatter from '../intFormatter';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import clientCreds from '../client_creds.json';

export default function Counter() {
	const [deleteModal, setDeleteModal] = useState(false);
	const [error, setError] = useState('');
	const [totalAmt, setTotalAmt] = useState('');
	const [tableData, setTableData] = useState();
	const [currentOrder, setCurrentOrder] = useState({});
	const [isDisabled, setIsDisabled] = useState(false);
	const [isParcel, setIsParcel] = useState(false);
	const [itemToDelete, setItemToDelete] = useState({});
	const [quantity, setQuantity] = useState(0);
	const [selectedMenu, setSelectedMenu] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const { menu } = useFetchMaster();

	const { id } = useParams();
	const getTableDetails = useCallback(() => {
		onSnapshot(
			database.orderID(id),
			doc => {
				setTableData(doc?.data());
				const total = doc?.data()?.orders?.reduce((acc, item) => {
					return acc + item?.quantity * item?.unitPrice;
				}, 0);
				setTotalAmt(total);
			},
			err => {
				setError(err.message);
			}
		);
	}, [id]);
	useEffect(() => {
		getTableDetails();
	}, [getTableDetails]);
	useEffect(() => {
		if (quantity <= 0) return setQuantity(0);
	}, [quantity]);
	async function addOrder() {
		try {
			if (quantity === 0) return setError('Quantity cannot be 0');
			setIsDisabled(true);
			if (tableData?.status === constants.TABLE_STATUS.BILLED) {
				setError(
					'Table is already billed or it is now billing ask the owner to stop the billing process'
				);
			} else {
				let newOrder = [];
				const includesItem = tableData.orders.filter(
					a => a.item === currentOrder.ITEM && a.isParcel === isParcel
				);
				if (includesItem.length !== 0) {
					const newQuantity = includesItem[0];
					newQuantity.quantity = newQuantity.quantity + quantity;
					newOrder = [...tableData.orders];
				} else {
					newOrder = [
						...tableData.orders,
						{
							item: currentOrder.ITEM,
							category: currentOrder.CATEGORY,
							quantity: quantity,
							unitPrice: currentOrder.PRICE,
							isParcel: isParcel,
						},
					];
				}
				await updateDoc(database.orderID(id), {
					orders: newOrder,
					items: newOrder.length,
					itemsDiff: true,
				});
				setQuantity(0);
				setCurrentOrder({});
				setIsParcel(false);
				setSelectedCategory('');
				setSelectedMenu('');
			}
		} catch (error) {
		} finally {
			setIsDisabled(false);
		}
	}
	async function deleteItem(_item) {
		try {
			setIsDisabled(true);
			if (tableData?.status === constants.TABLE_STATUS.BILLED) {
				setError(
					'Table is already billed or it is now billing ask the owner to stop the billing process'
				);
			} else {
				const newOrders = tableData.orders.filter(order => order !== _item);
				await updateDoc(database.orderID(id), {
					...tableData,
					orders: newOrders,
					items: newOrders.length,
					itemsDiff: true,
				});
				setItemToDelete({});
				setDeleteModal(false);
			}
		} catch (error) {
			setError(error.message);
		} finally {
			setIsDisabled(false);
		}
	}

	async function sendToKitchen() {
		try {
			setIsDisabled(true);
			await updateDoc(database.orderID(id), {
				itemsDiff: false,
			});
			const recpt = await kitchenRecpt(tableData);
			const winUrl = URL.createObjectURL(
				new Blob([recpt], { type: 'text/html' })
			);

			window.open(
				winUrl,
				'win',
				`width=800,height=400,screenX=200,screenY=200`
			);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsDisabled(false);
		}
	}

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

	async function onBill(data) {
		try {
			setIsDisabled(true);

			await addToSpreadsheet({ ...tableData, data });
			const d = new Date();
			const dateString =
				d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();

			await updateDoc(database.orderID(id), {
				...tableData,
				data,
				status: constants.TABLE_STATUS.BILLED,
				billedOn: dateString,
				billNo: TEST_STRING,
			});
			const a = await billRecpt(tableData);
			const winUrl = URL.createObjectURL(new Blob([a], { type: 'text/html' }));

			window.open(
				winUrl,
				'win',
				`width=800,height=400,screenX=200,screenY=200`
			);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsDisabled(false);
		}
	}

	return (
		<>
			<Header title='Counter Table' isBack to='/' />
			<Form.Group className='mt-4  w-50'>
				<Form.FloatingLabel label='Category'>
					<Form.Select
						readOnly={isDisabled}
						disabled={isDisabled}
						value={selectedCategory}
						onChange={e => {
							setSelectedCategory(e.target.value);
							setSelectedMenu('');
							setQuantity(0);
							setIsParcel(false);
						}}
						placeholder='menu'
					>
						<option value=''>-------Choose--------</option>
						{[...new Set(menu.map(item => item.CATEGORY))].map(item => (
							<option value={item} key={item}>
								{item}
							</option>
						))}
					</Form.Select>
				</Form.FloatingLabel>
			</Form.Group>
			{selectedCategory && (
				<Form.Group className='mt-4  w-50'>
					<Form.FloatingLabel label='Items'>
						<Form.Select
							readOnly={isDisabled}
							disabled={isDisabled}
							placeholder='menu'
							onChange={e => {
								setSelectedMenu(e.target.value);
								setCurrentOrder(
									menu.filter(
										item =>
											item.ITEM === e.target.value &&
											item.CATEGORY === selectedCategory
									)[0]
								);
								setQuantity(0);
								setIsParcel(false);
							}}
							value={selectedMenu}
						>
							<option value=''>-------Choose--------</option>
							{menu
								.filter(item => item.CATEGORY === selectedCategory)
								.map(item => (
									<option value={item.ITEM} key={item.ITEM}>
										{item.ITEM}
									</option>
								))}
						</Form.Select>
					</Form.FloatingLabel>
				</Form.Group>
			)}
			{selectedMenu && (
				<>
					<div className=' mt-4 d-flex flex-row'>
						<Button
							disabled={isDisabled}
							className='me-2'
							onClick={() => setQuantity(prevState => prevState - 1)}
						>
							-
						</Button>
						<Form.FloatingLabel label='Qty.'>
							<Form.Control value={quantity} readOnly disabled />
						</Form.FloatingLabel>
						<Button
							disabled={isDisabled}
							className='ms-2'
							onClick={() => setQuantity(prevState => prevState + 1)}
						>
							+
						</Button>
					</div>
					<Form.Check
						readOnly={isDisabled}
						disabled={isDisabled}
						className='mt-2'
						checked={isParcel}
						onChange={() => setIsParcel(!isParcel)}
						label='Parcel'
					/>
				</>
			)}
			{quantity > 0 && (
				<Button
					className='w-50 mt-2'
					readOnly={isDisabled}
					disabled={isDisabled}
					onClick={() => addOrder()}
				>
					Take Order
				</Button>
			)}
			{tableData?.orders?.length ? (
				<>
					<BSTable
						className='mt-2 user-select-none'
						striped
						responsive
						bordered
						hover
					>
						<thead>
							<tr>
								<th scope='col'>Item</th>
								<th scope='col'></th>
								<th scope='col'>Quantity</th>
								<th scope='col'>Unit Price</th>
								<th scope='col'>Total</th>
							</tr>
						</thead>
						<tbody>
							{tableData?.orders?.map((order, index) => (
								<tr
									onContextMenu={e => {
										e.preventDefault();
										setItemToDelete(order);
										setDeleteModal(true);
									}}
									key={index}
								>
									<td>{order.item}</td>
									<td>{order.isParcel ? 'Parcel' : 'Table'}</td>
									<td>{intFormatter(order.quantity)}</td>
									<td>{intFormatter(order.unitPrice)}</td>
									<td>{intFormatter(order.quantity * order.unitPrice)}</td>
								</tr>
							))}
							<tr>
								<td colSpan={3}></td>
								<td>Total</td>
								<td>{intFormatter(totalAmt)}</td>
							</tr>
						</tbody>
					</BSTable>
					<div className='d-flex flex-row justify-content-center mt-2'>
						<Button
							onClick={() =>
								onBill({
									name: 'COUNTER',
									address: 'NA',
									contact: '0000000000',
									upi: '',
									wa: '',
									mode: 'CASH',
								})
							}
							className='w-50 me-2'
							disabled={isDisabled}
							variant='primary'
						>
							Generate Bill
						</Button>
						<Button
							onClick={() => sendToKitchen()}
							className='w-50 ms-2'
							disabled={isDisabled}
							variant='secondary'
						>
							To Kitchen
						</Button>
					</div>
				</>
			) : (
				<h3 className='text-center mt-2'>This table has no orders</h3>
			)}
			<Prompt
				header='Delete Item'
				isOpen={deleteModal}
				onClose={() => {
					setDeleteModal(false);
					setItemToDelete({});
				}}
			>
				Are you sure you wanna delete this item ?
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<div style={{ width: '50%', marginRight: 10 }}>
						<Button
							className='w-100'
							variant='outline-primary'
							onClick={() => {
								setDeleteModal(false);
								setItemToDelete({});
							}}
							disabled={isDisabled}
						>
							No
						</Button>
					</div>
					<div style={{ width: '50%', marginLeft: 10 }}>
						<Button
							className='w-100'
							onClick={() => deleteItem(itemToDelete)}
							variant='outline-danger'
							disabled={isDisabled}
						>
							Yes
						</Button>
					</div>
				</div>
			</Prompt>
			<SnackBar
				message={error}
				isOpen={Boolean(error)}
				onClose={() => setError('')}
			/>
		</>
	);
}
