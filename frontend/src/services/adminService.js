import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://fipyteeltzqzeifwdpca.supabase.co';
const supabaseKey = 'sb_publishable_L-is02NKu53BpOQWh6d-Qg_ZxhJWH4o';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const adminService = {
  getUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('User') 
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erreur adminService:", error.message);
      return [];
    }
  }
};