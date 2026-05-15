import React, { useState, useEffect } from 'react';
import Logo from '../../assets/images/Logo.png';
import FormInput from '../../components/ui/FormInput';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const initialState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone_number: '',
  password: '',
  confirmPassword: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[^\d]+$/; // no digits allowed
const phoneRegex = /^[^a-zA-Z]+$/; // no letters allowed

function validate(values) {
  const errors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'Le prénom est requis.';
  } else if (!nameRegex.test(values.firstName.trim())) {
    errors.firstName = 'Le prénom ne doit pas contenir de chiffres.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Le nom est requis.';
  } else if (!nameRegex.test(values.lastName.trim())) {
    errors.lastName = 'Le nom ne doit pas contenir de chiffres.';
  }

  if (!values.username.trim()) {
    errors.username = "Le nom d'utilisateur est requis.";
  }

  if (!values.email.trim()) {
    errors.email = "L'email est requis.";
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Veuillez saisir un email valide.';
  }

  if (!values.phone_number.trim()) {
    errors.phone_number = 'Le numéro de téléphone est requis.';
  } else if (!phoneRegex.test(values.phone_number.trim())) {
    errors.phone_number = 'Le numéro de téléphone ne doit pas contenir de lettres.';
  }

  if (!values.password) {
    errors.password = 'Le mot de passe est requis.';
  } else if (values.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = 'Le mot de passe doit contenir au moins une lettre majuscule.';
  } else if (!/[0-9]/.test(values.password)) {
    errors.password = 'Le mot de passe doit contenir au moins un chiffre.';
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
  const [selectedRole, setSelectedRole] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Read the role chosen in step 1 (RolePage)
    const role = sessionStorage.getItem('selectedRole');
    if (!role) {
      // No role selected yet — send user back to step 1
      window.location.href = '/role';
      return;
    }
    setSelectedRole(role);
  }, []);

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
    setErrorMessage('');
    setSuccessMessage('');

    const payload = {
      first_name: formValues.firstName.trim(),
      last_name: formValues.lastName.trim(),
      username: formValues.username.trim(),
      email: formValues.email.trim(),
      phone_number: formValues.phone_number.trim(),
      password: formValues.password,
      role: selectedRole, // Role chosen in step 1
    };

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Erreur d'inscription");
        return;
      }

      setSuccessMessage('Compte créé avec succès !');
      sessionStorage.removeItem('selectedRole');

      setTimeout(() => {
        if (selectedRole === 'Client') {
          window.location.href = '/';
        } else {
          window.location.href = '/listings';
        }
      }, 1000);

    } catch (err) {
      setErrorMessage('Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  // Role label for display
  const roleLabel =
    selectedRole === 'Client'
      ? 'Trouver un appartement'
      : selectedRole === 'Publisher'
      ? 'Mettre mon appartement en location'
      : '';

  return (
    <div className="min-h-screen bg-orange-50 text-slate-900">
      <div className="h-32 bg-orange-400" />
      <main className="mx-auto -mt-24 flex w-full max-w-2xl flex-col items-center px-4 pb-12 sm:px-6">
        <div className="w-full overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
          <div className="px-8 py-10 text-center">
            <img src={Logo} alt="ImmoDIVA" className="mx-auto h-16 w-auto mt-8" />
            <h1 className="mt-6 text-3xl font-semibold text-slate-900">Créer un compte</h1>
            <p className="mt-3 text-sm text-slate-600">
              Remplissez ce formulaire pour finaliser votre inscription.
            </p>

            {/* Role badge — shows the selection made in step 1 */}
            {selectedRole && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm text-orange-700">
                <span className="font-medium">{roleLabel}</span>
                <a
                  href="/role"
                  className="text-orange-400 underline hover:text-orange-600 text-xs"
                >
                  Modifier
                </a>
              </div>
            )}
          </div>

          <div className="px-8 py-2">
            {errorMessage && (
              <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                {successMessage}
              </div>
            )}

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
              <div className="grid gap-6 md:grid-cols-2">
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
              </div>

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
                {loading ? 'Chargement...' : "Créer mon compte"}
              </button>
            </form>

            <div className="my-6 text-center text-sm text-slate-500">
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