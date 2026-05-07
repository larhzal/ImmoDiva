const fetch = require('node-fetch');

async function testFilters() {
    try {
        console.log('=== Test des filtres ===');

        // Test sans filtre
        const allResponse = await fetch('http://localhost:5000/api/annonces');
        const allData = await allResponse.json();
        console.log(`Toutes les annonces: ${allData.length}`);

        // Test filtre par ville
        const cityResponse = await fetch('http://localhost:5000/api/annonces?city=Meknès');
        const cityData = await cityResponse.json();
        console.log(`Annonces à Meknès: ${cityData.length}`);

        // Test filtre par prix
        const priceResponse = await fetch('http://localhost:5000/api/annonces?priceRange=below3000');
        const priceData = await priceResponse.json();
        console.log(`Annonces < 3000 MAD: ${priceData.length}`);

        // Test filtre par chambres
        const roomResponse = await fetch('http://localhost:5000/api/annonces?rooms=1');
        const roomData = await roomResponse.json();
        console.log(`Annonces 1 chambre: ${roomData.length}`);

        console.log('=== Test terminé ===');
    } catch (error) {
        console.error('Erreur:', error.message);
    }
}

testFilters();