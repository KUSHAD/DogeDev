import { createContext, useCallback, useContext, useState } from "react";
import constants from "../constants";
import clientCreds from "../client_creds.json";
import { GoogleSpreadsheet } from "google-spreadsheet";

const FetchMaster = createContext();

export function FetchMasterProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState([]);
  const [studentsAdd, setStudentsAdd] = useState([]);
  const fetchFields = useCallback(async () => {
    try {
      setIsLoading(true);
      const doc = new GoogleSpreadsheet(constants.SPREADSHEET.ID);
      await doc.useServiceAccountAuth(clientCreds);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[3];
      const rows = await sheet.getRows({
        offset: 0,
      });
      setFields(rows);
    } catch (error) {
      setError(
        `There was an error.${error.message}Please refresh the page and then try again`
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const doc = new GoogleSpreadsheet(constants.SPREADSHEET.ID);
      await doc.useServiceAccountAuth(clientCreds);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[2];
      const rows = await sheet.getRows({
        offset: 0,
      });
      setStudentsAdd(rows);
    } catch (error) {
      setError(
        `There was an error.${error.message}Please refresh the page and then try again`
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
    fetchStudents,
    studentsAdd,
    setStudentsAdd,
  };
  return <FetchMaster.Provider value={value}>{children}</FetchMaster.Provider>;
}

export function useFetchMaster() {
  return useContext(FetchMaster);
}
