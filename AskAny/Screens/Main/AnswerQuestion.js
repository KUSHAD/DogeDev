import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
	SafeAreaView,
	ScrollView,
	Image,
	TouchableOpacity,
} from 'react-native';
import { Button, Input, colors } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import ImageModal from '../../Components/ImageModal';
import QuestionsCard from '../../Components/QuestionCard';
import { useAnswers } from '../../hooks/useAnswers';
import { useAttachments } from '../../hooks/useAttachments';
import { useNotifications } from '../../hooks/useNotifications';
import { useQuestions } from '../../hooks/useQuestions';
import { useAuthProvider } from '../../Providers/AuthProvider';
export default function AnswerQuestion({ route, navigation }) {
	const {
		pickImageFromGallery,
		attachmentSrc,
		removeAttachment,
		uploadAttachment,
	} = useAttachments();
	const { newAnswer } = useAnswers();
	const { sendPushNotification, addNotification } = useNotifications();
	const { markQuestionAnswered } = useQuestions();
	const { authUser } = useAuthProvider();
	const [modal, setModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { control, handleSubmit } = useForm({
		mode: 'all',
		defaultValues: {
			text: '',
		},
	});

	async function onSubmit({ text }) {
		try {
			setIsLoading(true);
			const imgUrl = await uploadAttachment();
			await newAnswer({
				attachment: imgUrl || '',
				text: text,
				questionID: route.params.question._id,
				user: authUser.name,
			});
			await addNotification(
				route.params.question.user.uid,
				authUser.name,
				route.params.question.title,
				route.params.question._id
			);
			await markQuestionAnswered(route.params.question._id);
			await sendPushNotification(
				route.params.question.user.pushToken,
				text,
				authUser
			);
			navigation.pop();
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<ScrollView>
				<QuestionsCard question={route.params.question} />
				<SafeAreaView style={{ width: '80%', marginStart: '10%' }}>
					<Controller
						rules={{
							required: 'Answer text is required',
							maxLength: {
								value: 500,
								message: 'Answer text shoulbe be maximum 500 characters',
							},
						}}
						control={control}
						name='text'
						render={({
							formState: { errors },
							field: { onBlur, onChange, value },
						}) => (
							<Input
								multiline
								numberOfLines={5}
								label='Answer This Question'
								containerStyle={{ marginTop: 10 }}
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								errorMessage={errors?.text?.message}
							/>
						)}
					/>
					<Button
						loading={isLoading}
						onPress={pickImageFromGallery}
						raised
						title='Add Attachment'
						containerStyle={{ marginTop: 10, marginBottom: 10 }}
					/>
					{Boolean(attachmentSrc) && (
						<>
							<TouchableOpacity
								style={{ marginTop: 10 }}
								onPress={() => setModal(true)}
								onLongPress={() => pickImageFromGallery()}
							>
								<Image
									source={{ uri: attachmentSrc }}
									style={{ width: `100%`, aspectRatio: 1 / 1 }}
								/>
							</TouchableOpacity>
							<Button
								loading={isLoading}
								onPress={removeAttachment}
								type='outline'
								buttonStyle={{ borderColor: colors.error }}
								titleStyle={{ color: colors.error }}
								title='Remove Attachment'
								containerStyle={{ marginTop: 10, marginBottom: 10 }}
							/>
						</>
					)}
					<Button
						title='Answer'
						raised
						onPress={handleSubmit(onSubmit)}
						loading={isLoading}
					/>
				</SafeAreaView>
			</ScrollView>
			<ImageModal
				isOpen={modal}
				imgUri={attachmentSrc}
				onDismiss={() => setModal(false)}
			/>
		</>
	);
}
