import { Button, Modal } from 'antd';
import Image from 'next/image';

export default function ImageModal({ isOpen, src, onClose }) {
	return (
		<Modal
			onCancel={onClose}
			centered
			visible={isOpen}
			footer={[
				<Button type='link' onClick={() => window?.open(src)}>
					Open image in a new tab
				</Button>,
				<Button type='primary' onClick={onClose}>
					Close
				</Button>,
			]}
		>
			<Image src={src} width={500} height={500} />
		</Modal>
	);
}
