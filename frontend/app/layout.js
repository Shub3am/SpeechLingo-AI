import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SpeechLingo AI',
  description: 'Transforming Content with Regional Language Translation',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body classNameName={inter.classNameName}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
