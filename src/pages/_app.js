import "../pages/styles/globals.css";
import { AuthContextProvider } from "./_utils/auth-context";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
