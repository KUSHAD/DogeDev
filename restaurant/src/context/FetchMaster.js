import { createContext, useCallback, useContext, useState } from 'react';
import constants from '../constants';
import clientCreds from '../client_creds.json';
import { GoogleSpreadsheet } from 'google-spreadsheet';

const FetchMaster = createContext();

export function FetchMasterProvider({ children }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [fields, setFields] = useState([]);
	const [menu, setMenu] = useState([]);
	const fetchFields = useCallback(async () => {
		try {
			setIsLoading(true);
			const doc = new GoogleSpreadsheet(constants.SPREAD_SHEET.ID);
			await doc.useServiceAccountAuth(clientCreds);
			await doc.loadInfo();
			const sheet = doc.sheetsByIndex[3];
			const rows = await sheet.getRows({
				offset: 0,
			});
			setFields(rows);
		} catch (error) {
			setError(
				`There was an error.${error.message}.Please refresh the page and then try again`
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetchMenu = useCallback(async () => {
		try {
			setIsLoading(true);
			const doc = new GoogleSpreadsheet(constants.SPREAD_SHEET.ID);
			await doc.useServiceAccountAuth(clientCreds);
			await doc.loadInfo();
			const sheet = doc.sheetsByIndex[0];
			const rows = await sheet.getRows({
				offset: 0,
			});
			setMenu(rows);
		} catch (error) {
			setError(
				`There was an error.${error.message}.Please refresh the page and then try again`
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const value = {
		fetchFields,
		isLoading,
		error,
		fields,
		fetchMenu,
		menu,
	};
	return <FetchMaster.Provider value={value}>{children}</FetchMaster.Provider>;
}

export function useFetchMaster() {
	return useContext(FetchMaster);
}
