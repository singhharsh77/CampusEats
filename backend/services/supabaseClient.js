const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');   // add this line
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { fetch }    // pass fetch to Supabase client
);

module.exports = supabase;
