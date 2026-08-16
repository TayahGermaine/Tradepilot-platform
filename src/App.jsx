import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import BrokerPortal from './pages/BrokerPortal.jsx'
import AdminConsole from './pages/AdminConsole.jsx'
import TerminalPage from './pages/TerminalPage.jsx'
import MarketsPage from './pages/MarketsPage.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Wallet from './pages/Wallet.jsx'
import AIInsights from './pages/AIInsights.jsx'
import AIConsole from './pages/AIConsole.jsx'
import ClientDashboard from './pages/ClientDashboard.jsx'
import CreateAccount from './pages/Createaccount.jsx'
import NewsPage from './pages/NewsPage.jsx'
import AnalysisPage from './pages/AnalysisPage.jsx'
import KYC from './pages/KYC.jsx'
import { NotificationProvider } from './hooks/useNotifications.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'

export default function App() {
  return (
    <AuthProvider>
    <NotificationProvider>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/broker" element={<BrokerPortal />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/ai" element={<AIConsole />} />
      <Route path="/ai-insights" element={<AIInsights />} />
      <Route path="/dashboard" element={<ClientDashboard />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/admin" element={<AdminConsole />} />
      <Route path="/terminal" element={<TerminalPage />} />
      <Route path="/markets" element={<MarketsPage />} />
      <Route path="/createaccount" element={<CreateAccount />} />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="/kyc" element={<KYC />} />
    </Routes>
    </NotificationProvider>
    </AuthProvider>
  )
}
