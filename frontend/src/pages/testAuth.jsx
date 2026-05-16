// src/pages/TestAuth.jsx
import { useAuth } from "../hooks/useAuth";

export default function TestAuth() {
  const { user, loading, logout } = useAuth();

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Test useAuth</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <button onClick={logout}>Logout</button>
    </div>
  );
}