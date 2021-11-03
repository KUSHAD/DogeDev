import {
	Document,
	Page,
	Image,
	Text,
	StyleSheet,
	View,
} from '@react-pdf/renderer';

export default function RegPDF({ data }) {
	return (
		<Document
			author='Sports Village'
			producer='Sports Village'
			creator='Sports Village'
		>
			<Page style={styles.page} wrap size='A6'>
				<View style={styles.header}>
					<Image src='/logo192.png' style={styles.image} />
					<View style={styles.typeCont}>
						<Text>Space For Photograph</Text>
					</View>
				</View>
				<View style={styles.body}>
					<View style={styles.bodyInner}>
						<Text style={styles.vars}>{data?.id}</Text>
						<Text style={styles.vars}>{data?.name}</Text>
						<Text style={styles.vars}>{data?.subject}</Text>
						<Text>
							DOB:-
							<Text style={styles.vars}>
								{new Date(data?.dob).toLocaleDateString()}
							</Text>
						</Text>
						<Text>
							Blood Group:-<Text style={styles.vars}>{data?.blood}</Text>
						</Text>
						<Text>
							Parents:-
							<Text style={styles.vars}>
								{data?.father}
								{data.mother && `/${data?.mother}`}
							</Text>
						</Text>
						<Text>
							Address:-<Text style={styles.vars}>{data.address}</Text>
						</Text>
					</View>
				</View>
				<Image src='/pdf-footer.png' />
			</Page>
		</Document>
	);
}

const styles = StyleSheet.create({
	page: {
		padding: 10,
		flexDirection: 'column',
		fontSize: 11,
	},
	header: {
		flexDirection: 'row',
	},
	image: {
		width: 90,
		height: 64,
		marginRight: 'auto',
	},
	typeCont: {
		borderWidth: 2,
		marginTop: 10,
		width: '1.37in',
		height: '1.77in',
	},
	typeContText: {
		textAlign: 'center',
	},
	vars: {
		textTransform: 'uppercase',
		color: 'blue',
	},
	body: {
		flexDirection: 'column',
		height: '50%',
		flexGrow: 1,
		marginTop: 10,
	},
	bodyInner: {
		height: '100%',
		justifyContent: 'center',
	},
});
