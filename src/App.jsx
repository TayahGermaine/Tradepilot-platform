import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import BrokerPortal from './pages/BrokerPortal.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Wallet from './pages/Wallet.jsx'
import AIInsights from './pages/AIInsights.jsx'
import AdminConsole from './pages/AdminConsole.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/broker" element={<BrokerPortal />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/ai" element={<AIInsights />} />
      <Route path="/admin" element={<AdminConsole />} />
    </Routes>
  )
}
