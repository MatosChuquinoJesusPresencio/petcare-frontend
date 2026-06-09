import type { ReactNode } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="contenido-principal">
    <Header />
    <main className="flex-grow-1">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;
