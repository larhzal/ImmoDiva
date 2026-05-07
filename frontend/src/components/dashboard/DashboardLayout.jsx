

export default function DashboardLayout({ children }) {
  return (
    <div className="page">

      <main className="main">
        {children}
      </main>
    </div>
  );
}