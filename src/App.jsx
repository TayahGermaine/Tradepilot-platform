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
import CreateAccount from './pages/Createaccount.jsx'
import NewsPage from './pages/NewsPage.jsx'
import AnalysisPage from './pages/AnalysisPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/broker" element={<BrokerPortal />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/ai" element={<AIInsights />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/admin" element={<AdminConsole />} />
      <Route path="/terminal" element={<TerminalPage />} />
      <Route path="/markets" element={<MarketsPage />} />
      <Route path="/createaccount" element={<CreateAccount />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/analysis" element={<AnalysisPage />} />
    </Routes>
  )
}
