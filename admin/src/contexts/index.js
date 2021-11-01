import { FetchMasterProvider } from "./FetchMaster";
import { AuthProvider } from "./Auth";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <FetchMasterProvider>{children}</FetchMasterProvider>
    </AuthProvider>
  );
}
