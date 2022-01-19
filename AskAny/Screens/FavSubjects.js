import { useState } from 'react';
import { ListItem, Button, colors } from 'react-native-elements';
import { environment } from '../environment';
import { FlatList } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { useAuthProvider } from '../Providers/AuthProvider';
export default function FavSubjects({ navigation }) {
	const { isLoading, setFavSubjects, authUser } = useAuthProvider();
	const [subs, setSubs] = useState(authUser.favSubs);

	return (
		<>
			<FlatList
				keyExtractor={item => item}
				data={environment.subjects}
				renderItem={({ item }) => (
					<ListItem
						key={item}
						onPress={() => {
							if (subs.includes(item)) {
								const newSubs = subs.filter(_sub => _sub !== item);
								setSubs(newSubs);
							} else {
								setSubs(_prevSubs => [..._prevSubs, item]);
							}
						}}
					>
						<ListItem.Title>{item}</ListItem.Title>
						<ListItem.CheckBox
							onPress={() => {
								if (subs.includes(item)) {
									const newSubs = subs.filter(_sub => _sub !== item);
									setSubs(newSubs);
								} else {
									setSubs(_prevSubs => [..._prevSubs, item]);
								}
							}}
							checked={subs.includes(item)}
						/>
					</ListItem>
				)}
			/>
			{subs.length !== 0 && (
				<Button
					loading={isLoading}
					title='Proceed'
					iconRight
					onPress={() => setFavSubjects(subs, navigation)}
					icon={<Icon name='arrow-right-alt' color={colors.white} />}
				/>
			)}
		</>
	);
}
