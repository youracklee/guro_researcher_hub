
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Checking 'researchers' table schema...");
    
    // Try to select the embedding column
    const { data, error } = await supabase
        .from('researchers')
        .select('id, name, embedding')
        .limit(1);

    if (error) {
        console.error("Error querying researchers table:", error);
        if (error.code === '42703') {
            console.error("CONFIRMED: 'embedding' column is missing!");
        }
    } else {
        console.log("Success! 'researchers' table has 'embedding' column.");
        console.log("Sample data:", data);
    }
}

checkSchema();
