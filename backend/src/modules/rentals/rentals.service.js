const supabase = require('../../config/db')


// Envoyer une demande de location
exports.add_request = async (donnees) => {
  const { data, error } = await supabase
    .from('sent_request')
    .insert([donnees])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

