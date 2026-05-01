import React, { useState } from 'react';
import Logo from '../../assets/images/Logo.png';
import FormInput from '../../components/ui/FormInput';

const initialState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone_number: '', // AJOUT : champ manquant (requis DB + scénario US-01)
  password: '',
  confirmPassword: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'Le prénom est requis.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Le nom est requis.';
  }

  if (!values.username.trim()) {
    errors.username = "Le nom d'utilisateur est requis.";
  }

  // BUG CORRIGÉ : apostrophe typographique ' remplacée par apostrophe droite '
  if (!values.email.trim()) {
    errors.email = "L'email est requis.";
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Veuillez saisir un email valide.';
  }

  // AJOUT : validation du téléphone
  if (!values.phone_number.trim()) {
    errors.phone_number = 'Le numéro de téléphone est requis.';
  }

  if (!values.password) {
    errors.password = 'Le mot de passe est requis.';
  } else if (values.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'La confirmation du mot de passe est requise.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas.';
  }

  return errors;
}

export default function RegisterPage() {
  const [formValues, setFormValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const validationErrors = validate(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    // Payload aligné sur les noms de colonnes DB (first_name, last_name, phone_number)
    const payload = {
      first_name: formValues.firstName.trim(),
      last_name: formValues.lastName.trim(),
      username: formValues.username.trim(),
      email: formValues.email.trim(),
      phone_number: formValues.phone_number.trim(), // AJOUT
      password: formValues.password,
    };

    console.log('Register payload (step 1):', payload);
    sessionStorage.setItem('registrationData', JSON.stringify(payload));

    setTimeout(() => {
      setLoading(false);
      window.location.href = '/role';
    }, 500);
  };

  return (
    <div className="min-h-screen bg-orange-50 text-slate-900">
      <div className="h-32 bg-orange-400" />
      <main className="mx-auto -mt-24 flex w-full max-w-md flex-col items-center px-4 pb-12 sm:px-6">
        <div className="w-full overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
          <div className="bg-orange-100 px-8 py-10 text-center">
            <img src={Logo} alt="ImmoDIVA" className="mx-auto h-16 w-auto" />
            <h1 className="mt-6 text-3xl font-semibold text-slate-900">Créer un compte</h1>
            <p className="mt-3 text-sm text-slate-600">
              Remplissez ce formulaire puis choisissez votre rôle pour finaliser l'inscription.
            </p>
          </div>

          <div className="px-8 py-10">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                  id="lastName"
                  name="lastName"
                  label="Nom"
                  value={formValues.lastName}
                  onChange={handleChange}
                  placeholder="Entrez votre nom"
                  error={errors.lastName}
                />
                <FormInput
                  id="firstName"
                  name="firstName"
                  label="Prénom"
                  value={formValues.firstName}
                  onChange={handleChange}
                  placeholder="Entrez votre prénom"
                  error={errors.firstName}
                />
              </div>

              <FormInput
                id="username"
                name="username"
                label="Identifiant"
                value={formValues.username}
                onChange={handleChange}
                placeholder="Entrez un identifiant"
                error={errors.username}
              />

              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="email@exemple.com"
                error={errors.email}
              />

              {/* AJOUT : champ téléphone manquant dans l'ancienne version */}
              <FormInput
                id="phone_number"
                name="phone_number"
                type="tel"
                label="Numéro de téléphone"
                value={formValues.phone_number}
                onChange={handleChange}
                placeholder="+212 6XX XXX XXX"
                error={errors.phone_number}
              />

              <FormInput
                id="password"
                name="password"
                type="password"
                label="Mot de passe"
                value={formValues.password}
                onChange={handleChange}
                placeholder="Min. 8 caractères"
                error={errors.password}
              />

              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirmation du mot de passe"
                value={formValues.confirmPassword}
                onChange={handleChange}
                placeholder="Retapez le mot de passe"
                error={errors.confirmPassword}
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
              >
                {loading ? 'Chargement...' : 'Soumettre'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
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
