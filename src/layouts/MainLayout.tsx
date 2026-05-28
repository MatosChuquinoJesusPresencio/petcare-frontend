import type { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="d-flex flex-column min-vh-100" style={{ background: '#fff' }}>
    <Header />
    <main className="flex-grow-1">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;
