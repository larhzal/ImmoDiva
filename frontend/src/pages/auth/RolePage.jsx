import React, { useEffect, useState } from 'react';
import Logo from '../../assets/images/Logo.png';

const roles = [
  {
    value: 'locataire',
    title: 'Trouver un appartement',
    description: 'Postulez aux annonces et trouvez le logement qui vous convient.',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=60',
  },
  {
    value: 'publicateur',
    title: 'Mettre mon appartement en location',
    description: 'Publiez votre bien et recevez des demandes de location facilement.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=60',
  },
];

export default function RolePage() {
  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('registrationData');
    if (stored) {
      setRegistrationData(JSON.parse(stored));
    }
  }, []);

  const chooseRole = (value) => {
    if (!registrationData) {
      window.location.href = '/register';
      return;
    }

    // BUG CORRIGÉ : suppression de provider: 'supabase' (pas de backend encore)
    const payload = {
      ...registrationData,
      role: value,
    };

    console.log('Register payload (final):', payload);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Votre compte a été créé avec succès. Vous allez être redirigé.');
      sessionStorage.removeItem('registrationData');
      setTimeout(() => {
        // Redirection selon le rôle choisi
        if (value === 'locataire') {
          window.location.href = '/';
        } else {
          window.location.href = '/listings';
        }
      }, 1200);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-orange-50 text-slate-900">
      <div className="h-32 bg-orange-400" />
      <main className="mx-auto -mt-24 flex w-full max-w-6xl flex-col items-center px-4 pb-12 sm:px-6">
        <div className="w-full overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
          <div className="bg-orange-100 px-8 py-10 text-center">
            <img src={Logo} alt="ImmoDIVA" className="mx-auto h-16 w-auto" />
            <h1 className="mt-6 text-3xl font-semibold text-slate-900">Je suis ici pour...</h1>
            <p className="mt-3 text-sm text-slate-600">
              Choisissez votre rôle pour finaliser votre inscription.
            </p>
          </div>

          <div className="px-8 py-10">
            {successMessage && (
              <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                {successMessage}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => chooseRole(role.value)}
                  disabled={loading}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-orange-300 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="mb-4 h-40 overflow-hidden rounded-3xl bg-slate-100">
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${role.image}')` }}
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 transition group-hover:text-orange-600">
                    {role.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{role.description}</p>
                </button>
              ))}
            </div>

            {!registrationData && (
              <div className="mt-8 rounded-3xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm text-slate-700">
                Aucune inscription en cours n'a été détectée.{' '}
                <a href="/register" className="font-semibold text-orange-600">
                  Retour au formulaire
                </a>
                .
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}