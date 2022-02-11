import '../styles/globals.css'
import { getServerSideProps } from 'next/app'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </>
  )
}

export default MyApp
