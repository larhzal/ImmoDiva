import React from 'react';
import NavbarLanding from '../components/layout/NavbarLanding';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-orange-50 text-slate-900">
      <NavbarLanding />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section className="grid gap-10 rounded-[36px] bg-white px-6 py-10 shadow-soft sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-700">
              ImmoDiva - Votre plateforme immobilière
            </span>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Trouvez votre prochain appartement ou publiez votre bien facilement.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Découvrez les meilleures annonces de location et rejoignez ImmoDiva pour gérer vos demandes ou publier vos appartements.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="/login" className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
                Se connecter
              </a>
              <a href="/role" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-orange-300 hover:text-orange-600">
                Créer un compte
              </a>
            </div>
          </div>

          <div className="rounded-[32px] bg-orange-50 p-6 shadow-inner sm:p-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Annonces récentes</h2>
              <p className="text-sm leading-6 text-slate-600">
                Parcourez une sélection d’appartements disponibles en location et trouvez le logement qui vous correspond.
              </p>
            </div>
            <div className="mt-8 grid gap-4">
              <article className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Paris 11</span>
                  <span className="text-sm font-semibold text-orange-600">850 €/mois</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Studio lumineux proche des transports.</p>
              </article>
              <article className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Lyon 3</span>
                  <span className="text-sm font-semibold text-orange-600">1 100 €/mois</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">T2 moderne avec balcon et vue dégagée.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
