import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

// Use the same configuration as in client.ts
const SUPABASE_URL = "https://xanaccmdizurlvjrwizh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbmFjY21kaXp1cmx2anJ3aXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTE4MzUsImV4cCI6MjA2MzMyNzgzNX0.6zZ5TSU7appoIE4_b7ob-dl1zATk3l6L27_SmbfNu2c";

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const products = [
  {
    name: "MacBook Pro 14\" M3 Pro",
    description: "Powerful laptop with Apple M3 Pro chip, 18GB RAM, and 512GB SSD. Perfect for professionals and creative work.",
    price: 89999.99,
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000",
    image_url_2: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000",
    image_url_3: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000"
  },
  {
    name: "Dell XPS 15",
    description: "Premium Windows laptop with Intel Core i9, 32GB RAM, and 1TB SSD. Stunning 4K OLED display.",
    price: 79999.99,
    image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
    image_url_2: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
    image_url_3: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000"
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    description: "Business laptop with Intel Core i7, 16GB RAM, and 512GB SSD. Known for durability and excellent keyboard.",
    price: 69999.99,
    image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
    image_url_2: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
    image_url_3: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000"
  },
  {
    name: "ASUS ROG Zephyrus G14",
    description: "Gaming laptop with AMD Ryzen 9, 32GB RAM, and 1TB SSD. Powerful GPU for gaming and content creation.",
    price: 74999.99,
    image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
    image_url_2: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
    image_url_3: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000"
  },
  {
    name: "HP Spectre x360",
    description: "Convertible laptop with Intel Core i7, 16GB RAM, and 512GB SSD. Beautiful 2-in-1 design with touch screen.",
    price: 64999.99,
    image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
    image_url_2: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
    image_url_3: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000"
  }
];

async function seedProducts() {
  try {
    console.log('Starting to seed products...');
    
    // First, check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Error connecting to Supabase:', testError);
      return;
    }
    
    console.log('Successfully connected to Supabase');

    // Clear existing products
    console.log('Clearing existing products...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('Error clearing products:', deleteError);
      return;
    }
    console.log('Successfully cleared existing products');

    // Insert new products
    console.log('Inserting new products...');
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (error) {
      console.error('Error inserting products:', error);
      return;
    }

    console.log('Successfully seeded products:', data);
  } catch (error) {
    console.error('Unexpected error during seeding:', error);
  }
}

// Run the seed function
seedProducts(); 