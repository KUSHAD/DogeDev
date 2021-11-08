import FAB from '../Components/FAB';
import Header from '../Components/Header';
import { MdAdd } from 'react-icons/md';
import { useAuthProvider } from '../context/Auth';
import { useCallback, useEffect, useState } from 'react';
import Prompt from '../Components/Prompt';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
	addDoc,
	onSnapshot,
	query,
	where,
	deleteDoc,
} from 'firebase/firestore';
import { database } from '../firebase';
import constants from '../constants';
import SnackBar from '../Components/SnackBar';
import ListGroup from 'react-bootstrap/ListGroup';
import { MdRefresh, MdFastfood } from 'react-icons/md';

export default function Tables() {
	const [tableModal, setTableModal] = useState(false);
	const [tableName, setTableName] = useState('');
	const [isDisabled, setIsDisabled] = useState(false);
	const [tables, setTables] = useState([]);
	const { isOwner, user } = useAuthProvider();
	const [error, setError] = useState('');
	const [tableId, setTableId] = useState('');
	const [deleteModal, setDeleteModal] = useState(false);
	async function onAddTable() {
		try {
			setIsDisabled(true);
			await addDoc(database.orderColl(), {
				name: tableName,
				orders: [],
				status: constants.TABLE_STATUS.IN_PROGRESS,
				userId: user,
				items: 0,
				itemsDiff: false,
			});
			setTableName('');
			setTableModal(false);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsDisabled(false);
		}
	}

	const getTables = useCallback(() => {
		if (isOwner) {
			const q = query(
				database.orderColl(),
				where('status', '==', constants.TABLE_STATUS.IN_PROGRESS)
			);
			onSnapshot(
				q,
				({ docs }) => {
					const data = docs.map(doc => {
						return { ...doc.data(), id: doc.id };
					});
					setTables(data);
				},
				err => {
					setError(err.message);
				}
			);
		} else {
			const q = query(database.orderColl(), where('userId', '==', user));
			onSnapshot(
				q,
				({ docs }) => {
					const data = docs.map(doc => {
						return { ...doc.data(), id: doc.id };
					});
					setTables(data);
				},
				err => {
					setError(err.message);
				}
			);
		}
	}, [isOwner, user]);

	async function handleDeleteTable() {
		try {
			setIsDisabled(true);
			await deleteDoc(database.orderID(tableId));
			setTableId('');
			setDeleteModal(false);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsDisabled(false);
		}
	}

	useEffect(() => {
		getTables();
	}, [getTables]);

	return (
		<>
			<Header title='Tables' />
			<div className='d-flex flex-row my-2'>
				<div className='me-auto' />
				<Button onClick={getTables} className='me-2'>
					<MdRefresh /> Refresh
				</Button>
			</div>
			<ListGroup>
				{tables.map(table => (
					<ListGroup.Item
						onContextMenu={e => {
							e.preventDefault();
							if (isOwner) return;
							setTableId(table.id);
							setDeleteModal(true);
						}}
						key={table.id}
						action
					>
						<div className='d-flex flex-row'>
							<MdFastfood className='mt-2' />
							<h4>{table.name}</h4>
						</div>
						<h6>{table.status} </h6> {isOwner && <h6>Waiter {table.userId}</h6>}
					</ListGroup.Item>
				))}
			</ListGroup>
			{!isOwner && (
				<FAB
					icon={<MdAdd />}
					text='Add Table'
					onClick={() => setTableModal(true)}
				/>
			)}
			<SnackBar isOpen={error} onClose={() => setError('')} error={error} />
			<Prompt
				header='Add Table'
				isOpen={tableModal}
				onClose={() => {
					setTableModal(false);
					setTableName('');
				}}
			>
				<Form.FloatingLabel label='Table Name'>
					<Form.Control
						placeholder='s'
						value={tableName}
						onChange={e => setTableName(e.target.value.toUpperCase())}
					/>
				</Form.FloatingLabel>
				<Button
					onClick={onAddTable}
					className='w-100 mt-2'
					disabled={!tableName || isDisabled}
				>
					Add
				</Button>
			</Prompt>
			<Prompt
				header='Delete Table'
				isOpen={deleteModal}
				onClose={() => {
					setDeleteModal(false);
					setTableId('');
				}}
			>
				<>
					Are you sure you wanna delete this table ?
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
								onClick={() => {
									setDeleteModal(false);
									setTableId('');
								}}
								variant='outline-primary'
								disabled={isDisabled}
							>
								No
							</Button>
						</div>
						<div style={{ width: '50%', marginLeft: 10 }}>
							<Button
								className='w-100'
								onClick={() => handleDeleteTable()}
								variant='outline-danger'
								disabled={isDisabled}
							>
								Yes
							</Button>
						</div>
					</div>
				</>
			</Prompt>
		</>
	);
}
