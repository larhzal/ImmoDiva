import React, { useState } from 'react';
import Logo from '../../assets/images/Logo.png';

const roles = [
  {
    value: 'Client',
    title: 'Trouver un appartement',
    description: 'Postulez aux annonces et trouvez le logement qui vous convient.',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=60',
  },
  {
    value: 'Publisher',
    title: 'Mettre mon appartement en location',
    description: 'Publiez votre bien et recevez des demandes facilement.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=60',
  },
];

export default function RolePage() {
  const [selected, setSelected] = useState(null);

  const chooseRole = (value) => {
    setSelected(value);
    // Store chosen role so RegisterPage can read it
    sessionStorage.setItem('selectedRole', value);
    setTimeout(() => {
      window.location.href = '/register';
    }, 300);
  };

  return (
    <div className="min-h-screen bg-orange-50 text-slate-900">
      <div className="h-32 bg-orange-400" />
      <main className="mx-auto -mt-24 flex w-full max-w-6xl flex-col items-center px-4 pb-12 sm:px-6">
        <div className="w-full overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
          <div className="px-8 py-10 text-center">
            <img src={Logo} alt="ImmoDIVA" className="mt-6 mx-auto h-16 w-auto" />
            <h1 className="mt-6 text-3xl font-semibold text-slate-900">Je suis ici pour...</h1>
            <p className="mt-3 text-sm text-slate-600">
              Choisissez votre rôle pour commencer votre inscription.
            </p>
          </div>

          <div className="px-8 py-2 pb-10">
            <div className="grid gap-6 sm:grid-cols-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => chooseRole(role.value)}
                  disabled={!!selected}
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

            <div className="mt-8 mb-2 text-center text-sm text-slate-500">
              Vous avez déjà un compte ?{' '}
              <a href="/login" className="font-semibold text-orange-600 hover:text-orange-700">
                Se connecter
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}