import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../components/layout/Navbar';

import '../../styles/pages/listings.css'

const priceOptions = [
    { value: '', label: 'Tous les prix' },
    { value: 'below3000', label: 'Moins de 3000 MAD' },
    { value: '3000-6000', label: '3000 - 6000 MAD' },
    { value: 'above6000', label: 'Plus de 6000 MAD' },
];

const roomOptions = [
    { value: '', label: 'Peu importe' },
    { value: '1', label: '1 Chambre' },
    { value: '2', label: '2 Chambres' },
    { value: '3plus', label: '3+ Chambres' },
];

const cityOptions = [
    { value: '', label: 'Toutes les villes' },
    { value: 'Casablanca', label: 'Casablanca' },
    { value: 'Rabat', label: 'Rabat' },
    { value: 'Meknès', label: 'Meknès' },
];

const ListingsPage = () => {

    const navigate = useNavigate();

    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [city, setCity] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [rooms, setRooms] = useState('');

    const fetchAnnonces = async ({
        city = '',
        priceRange = '',
        rooms = ''
    } = {}) => {

        setLoading(true);
        setError(null);

        try {

            const params = new URLSearchParams();

            if (city) params.append('city', city);
            if (priceRange) params.append('priceRange', priceRange);
            if (rooms) params.append('rooms', rooms);

            const url =
                `http://localhost:5000/api/annonces${
                    params.toString()
                        ? `?${params.toString()}`
                        : ''
                }`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    'Erreur lors de la récupération des données.'
                );
            }

            const data = await response.json();

            setAnnonces(data);

        } catch (err) {

            console.error('Erreur Fetch:', err);

            setError(
                "Désolé, impossible de charger les annonces pour le moment."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnonces();
    }, []);

    const handleSearch = () => {
        fetchAnnonces({
            city,
            priceRange,
            rooms
        });
    };

    const handleReset = () => {

        setCity('');
        setPriceRange('');
        setRooms('');

        fetchAnnonces();
    };

    return (
        <>
        <Navbar/>
        <div className="page-container">
            {/* HERO */}
            <section className="hero-section">

                <h1 className="hero-title">
                    Trouvez l'appartement idéal au Maroc
                </h1>

                <p className="hero-subtitle">
                    Votre prochain chez-vous à portée de clic
                </p>

            </section>

            {/* SEARCH */}
            <div className="search-bar">

                <div className="search-field">

                    <label>Ville / Région</label>

                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    >

                        {cityOptions.map((option) => (

                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="search-field">

                    <label>Prix</label>

                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                    >

                        {priceOptions.map((option) => (

                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="search-field">

                    <label>Nombre de chambres</label>

                    <select
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)}
                    >

                        {roomOptions.map((option) => (

                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="search-actions">

                    <button
                        className="search-btn"
                        onClick={handleSearch}
                    >
                        🔍 Rechercher
                    </button>

                    <button
                        className="reset-btn"
                        onClick={handleReset}
                    >
                        Réinitialiser
                    </button>

                </div>

            </div>

            {/* LOADING */}
            {loading && (
                <div className="loading-container">
                    <p>Chargement des annonces...</p>
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="error-container">
                    <p>{error}</p>
                </div>
            )}

            {/* LISTINGS */}
            {!loading && !error && annonces.length > 0 && (

                <div className="listings-grid">

                    {annonces.map((annonce) => {

                        const listingId =
                            annonce.id ||
                            annonce.ID;

                        const pictures =
                            annonce.pictures ||
                            annonce.Pictures ||
                            [];

                        const image =
                            pictures.length > 0
                                ? pictures[0].url
                                : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa';

                        return (

                            <div
                                key={listingId}
                                className="listing-card"
                            >

                                <img
                                    src={image}
                                    alt="Appartement"
                                    className="listing-card-image"
                                />

                                <div className="listing-card-content">

                                    <h3 className="listing-card-title">
                                        {annonce.title}
                                    </h3>

                                    <p className="listing-card-price">
                                        {annonce.monthly_price} MAD / mois
                                    </p>

                                    <p>
                                        {annonce.city}
                                    </p>

                                    <p>
                                        {annonce.number_rooms} chambres
                                    </p>

                                </div>

                                <button
                                    className="detail-btn"
                                    onClick={() =>
                                        navigate(`/apartment/${listingId}`)
                                    }
                                >
                                    Voir les détails
                                </button>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
        </>
    );
};

export default ListingsPage;