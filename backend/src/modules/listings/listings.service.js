const { supabase } = require('../../config/db');

const getAnnonces = async ({ city, priceRange, rooms } = {}) => {
    let query = supabase
        .from('Apartment')
        .select('*, Pictures(*)')
        .eq('status', 'Acceptée'); //  filtre ajouté

    if (city) {
        query = query.eq('city', city);
    }

    if (priceRange) {
        switch (priceRange) {
            case 'below3000':
                query = query.lt('monthly_price', 3000);
                break;
            case '3000-6000':
                query = query.gte('monthly_price', 3000).lte('monthly_price', 6000);
                break;
            case 'above6000':
                query = query.gt('monthly_price', 6000);
                break;
        }
    }

    if (rooms) {
        switch (rooms) {
            case '1':
                query = query.eq('number_rooms', 1);
                break;
            case '2':
                query = query.eq('number_rooms', 2);
                break;
            case '3plus':
                query = query.gte('number_rooms', 3);
                break;
        }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
};

const getAnnonceById = async (id) => {
    const { data, error } = await supabase
        .from('Apartment')
        .select('*, Pictures(*)')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

const getDistinctCities = async () => {
    const { data, error } = await supabase
        .from('Apartment')
        .select('city')
        .eq('status', 'Acceptée') //  filtre ajouté
        .not('city', 'is', null)
        .neq('city', '');

    if (error) throw error;

    const uniqueCities = [...new Set(data.map((row) => row.city))].sort();
    return uniqueCities;
};

module.exports = { getAnnonces, getAnnonceById, getDistinctCities };