import { updateDoc } from 'firebase/firestore/lite';
import Button from 'react-bootstrap/Button';
import { database, firebaseStorage } from '../../firebase';
import { ref, deleteObject } from 'firebase/storage';
export default function DeleteDocModal({
	expID,
	docs,
	deleteDoc,
	onClose,
	setDocs,
	setError,
	setIsDisabled,
	isDisabled,
}) {
	async function deleteDocFromDB() {
		try {
			setIsDisabled(true);
			const filteredDocs = docs.filter(doc => doc !== deleteDoc);
			await updateDoc(database.docs(expID), {
				files: filteredDocs,
			});

			const storageRef = ref(firebaseStorage, deleteDoc);

			await deleteObject(storageRef);

			setDocs(filteredDocs);
		} catch (error) {
			setError(error.mesage);
		} finally {
			onClose();
			setIsDisabled(false);
		}
	}
	return (
		<div className='d-flex flex-column'>
			Are you sure sure you wanna delete this doc ?
			<div className='d-flex flex-row'>
				<Button disabled={isDisabled} className='w-50 me-2' onClick={onClose}>
					No
				</Button>
				<Button
					disabled={isDisabled}
					variant='danger'
					onClick={deleteDocFromDB}
					className='w-50 ms-2'
				>
					Yes
				</Button>
			</div>
		</div>
	);
}
