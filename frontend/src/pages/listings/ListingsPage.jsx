// src/pages/listings/ListingsPage.jsx

import React from 'react';
import Navbar from '../../components/layout/Navbar';

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-orange-50 text-slate-900">

      {/* Navbar avec bouton Deconnexion */}
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-12 sm:px-6 mt-8">
        <div className="w-full rounded-[36px] border border-slate-200 bg-white shadow-soft p-10 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Annonces</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Bienvenue sur la page des annonces. Cette page est prete pour afficher les appartements disponibles.
          </p>
        </div>
      </main>

    </div>
  );
}