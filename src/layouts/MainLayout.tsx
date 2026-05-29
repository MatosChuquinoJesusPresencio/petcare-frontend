import type { ReactNode } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="d-flex flex-column min-vh-100" style={{ background: '#fff' }}>
    <Header />
    <main className="flex-grow-1">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;
