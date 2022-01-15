import { Overlay } from 'react-native-elements';
import { Image } from 'react-native';

export default function ImageModal({ isOpen, onDismiss, imgUri }) {
	return (
		<Overlay
			isVisible={isOpen}
			animationType='slide'
			onBackdropPress={onDismiss}
		>
			<Image
				source={{ uri: imgUri }}
				style={{
					width: `80%`,
					aspectRatio: 1 / 1,
				}}
			/>
		</Overlay>
	);
}
