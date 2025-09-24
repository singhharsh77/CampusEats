const supabase = require('./services/supabaseClient');

async function testConnection() {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error connecting to Supabase:', error);
  } else {
    console.log('Supabase connection works! Users:', data);
  }
}

testConnection();
