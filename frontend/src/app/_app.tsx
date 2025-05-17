import { AppProps } from 'next/app';
import { AuthProvider } from '../lib/hooks/useAuth';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
