const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vmomuhwalrflusvfdrmc.supabase.co';
const SUPABASE_KEY = 'sb_secret_JYkm7Xu7W5Oe3zi_kfihyQ_-hyAMeqB'; // Service Key

async function testInsert() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const payload = {
        species: "dog",
        size: "medium",
        gender: "male",
        status: "available",
        image_url: "https://vmomuhwalrflusvfdrmc.supabase.co/storage/v1/object/public/pet-images/pets/adaba750-5ae9-4eff-83fd-ee6cc70aed38.png",
        ong_id: "ee4d596f-09a8-41d3-9920-af13b1141670",
        name: "teste",
        breed: "teste",
        description: "testes"
    };

    console.log('Inserting payload:', payload);

    const { data, error } = await supabase
        .from('pets')
        .insert(payload)
        .select()
        .single();

    if (error) {
        console.error('Insert Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Success:', data);
    }
}

testInsert();
