/** @fileoverview Layout wrapper with Sidebar + TopBar + main content area */
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function PageWrapper({ children }) {
  return (
    <div className="flex min-h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
