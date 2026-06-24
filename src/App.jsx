import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DaftarTagihan from './pages/DaftarTagihan';
import BayarTagihan from './pages/BayarTagihan';
import DaftarWarga from './pages/DaftarWarga';
import LaporanKeuangan from './pages/LaporanKeuangan';
import './index.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tagihan" element={<DaftarTagihan />} />
            <Route path="bayar" element={<BayarTagihan />} />
            <Route path="warga" element={<DaftarWarga />} />
            <Route path="laporan" element={<LaporanKeuangan />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
