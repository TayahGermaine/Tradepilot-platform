import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import BrokerPortal from './pages/BrokerPortal.jsx'
import AdminConsole from './pages/AdminConsole.jsx'
import TerminalPage from './pages/TerminalPage.jsx'
import MarketsPage from './pages/MarketsPage.jsx'
import CreateAccount from './pages/CreateAccount.jsx'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/terminal" element={<TerminalPage />} />
      <Route path="/markets" element={<MarketsPage />} />
      <Route path="/broker" element={<BrokerPortal />} />
      <Route path="/admin" element={<AdminConsole />} />
      
    </Routes>
  )
}
