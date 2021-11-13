import { useLocation, useParams } from 'react-router-dom';
import Header from '../Components/Header';
import { onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { database } from '../firebase';
import SnackBar from '../Components/SnackBar';
import { useFetchMaster } from '../context/FetchMaster';
import { useAuthProvider } from '../context/Auth';
import Prompt from '../Components/Prompt';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import constants from '../constants';
import BSTable from 'react-bootstrap/Table';
import kitchenRecpt from '../Templates/kitchen';
import Bill from './Bill';

export default function Table() {
	const [billModal, setBillModal] = useState(false);
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
	const { isOwner } = useAuthProvider();
	const {
		state: { name: tableName },
	} = useLocation();
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
			const tabledata = await getDoc(database.orderID(id));
			if (tabledata.data().status === constants.TABLE_STATUS.BILLED) {
				setError('Table already billed');
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
			const tabledata = await getDoc(database.orderID(id));
			if (tabledata.data().status === constants.TABLE_STATUS.BILLED) {
				setError('Table already billed');
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

	function generateBill() {
		setBillModal(true);
	}

	async function askToBill() {
		try {
			setIsDisabled(true);
			await updateDoc(database.orderID(id), {
				askToBill: true,
			});
		} catch (error) {
			setError(error.message);
		} finally {
			setIsDisabled(false);
		}
	}

	return (
		<>
			<Header title={tableName} to='/' isBack />
			<div className='mx-2'>
				{!isOwner && (
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
				)}
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
			</div>
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

										if (isOwner) return;
										setItemToDelete(order);
										setDeleteModal(true);
									}}
									key={index}
								>
									<td>{order.item}</td>
									<td>{order.isParcel ? 'Parcel' : 'Table'}</td>
									<td>{order.quantity}</td>
									<td>{order.unitPrice}</td>
									<td>{order.quantity * order.unitPrice}</td>
								</tr>
							))}
							<tr>
								<td colSpan={3}></td>
								<td>Total</td>
								<td>{totalAmt}</td>
							</tr>
						</tbody>
					</BSTable>
					{isOwner ? (
						<div className='d-flex flex-row justify-content-center mt-2'>
							<Button
								onClick={() => generateBill()}
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
					) : (
						<div className='d-flex flex-column text-center '>
							<Button
								onClick={() => askToBill()}
								className='w-50 mx-auto'
								disabled={isDisabled}
								variant='primary'
							>
								Ask To Bill
							</Button>
							{tableData?.askToBill ? (
								<strong>We are informing the owner to bill this table</strong>
							) : (
								<strong>
									Click on this button to inform the owner to bill this table
								</strong>
							)}
						</div>
					)}
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
			<Prompt
				isOpen={billModal}
				header='Generate Bill'
				onClose={() => setBillModal(false)}
			>
				<Bill />
			</Prompt>
			<SnackBar
				message={error}
				isOpen={Boolean(error)}
				onClose={() => setError(error)}
			/>
			{isOwner && (
				<SnackBar
					variant='success'
					message={`The waiter has requested to bill this table`}
					isOpen={tableData?.askToBill}
					onClose={async () => {
						try {
							await updateDoc(database.orderID(id), {
								askToBill: false,
							});
						} catch (error) {
							setError(error.message);
						}
					}}
				/>
			)}
		</>
	);
}
