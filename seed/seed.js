// Seed Firestore with the default FISHKO catalogue.  Run:  npm run seed
require('dotenv').config();
const { db } = require('../config/firebase');

const PRODUCTS = [
  { id:'neymeen', name:'Neymeen', english:'Seer / King Fish', price:650, mrp:780, sku:'FK-NEY01', unit:'kg', cat:'premium', badge:'Premium', rating:4.9, reviews:212, stock:true, qty:40, featured:true, daily:true, desc:'Firm, meaty steaks — the king of curry cuts and tawa fry.' },
  { id:'karimeen', name:'Karimeen', english:'Pearl Spot', price:550, sku:'FK-KAR01', unit:'kg', cat:'premium', badge:'Kerala Special', rating:4.9, reviews:301, stock:true, qty:25, featured:true, daily:true, desc:'The backwater icon — perfect for Karimeen Pollichathu.' },
  { id:'avoli', name:'Avoli', english:'Silver Pomfret', price:720, mrp:900, sku:'FK-AVO01', unit:'kg', cat:'premium', badge:'Premium', rating:4.8, reviews:188, stock:true, qty:18, featured:true, daily:true, desc:'Buttery white flesh. A coastal delicacy.' },
  { id:'ayala', name:'Ayala', english:'Indian Mackerel', price:280, mrp:340, sku:'FK-AYA01', unit:'kg', cat:'daily', badge:'Daily Catch', rating:4.7, reviews:430, stock:true, qty:60, featured:true, daily:true, desc:'Rich and oily — the everyday favourite for fry and curry.' },
  { id:'mathi', name:'Mathi', english:'Sardine', price:180, sku:'FK-MAT01', unit:'kg', cat:'daily', badge:'Daily Catch', rating:4.6, reviews:512, stock:true, qty:75, featured:false, daily:true, desc:'Beloved Chaala — unbeatable in a clay-pot curry.' },
  { id:'chura', name:'Chura', english:'Tuna', price:320, sku:'FK-CHU01', unit:'kg', cat:'daily', badge:'Daily Catch', rating:4.6, reviews:267, stock:true, qty:45, featured:false, daily:true, desc:'Lean, protein-packed deep-sea tuna.' },
  { id:'kozhi-ayala', name:'Kozhi Ayala', english:'Bullet Tuna', price:240, sku:'FK-KOZ01', unit:'kg', cat:'daily', badge:'Daily Catch', rating:4.5, reviews:143, stock:true, qty:8, featured:false, daily:true, desc:'Firm bullet tuna — great dry-roasted or in coconut curry.' },
  { id:'netholi', name:'Netholi', english:'Anchovy', price:220, sku:'FK-NET01', unit:'kg', cat:'daily', badge:'Daily Catch', rating:4.5, reviews:198, stock:true, qty:30, featured:false, daily:true, desc:'Tiny silver anchovies — crisp them whole for a crunchy fry.' },
  { id:'kannava', name:'Kannava', english:'Squid', price:450, mrp:560, sku:'FK-KAN01', unit:'kg', cat:'shellfish', badge:'Fresh', rating:4.8, reviews:176, stock:true, qty:22, featured:true, daily:false, desc:'Cleaned, tender squid rings — quick-cooking for roast.' },
  { id:'karuvadu', name:'Karuvadu', english:'Sun-Dried Fish', price:400, sku:'FK-KRV01', unit:'500g', cat:'dried', badge:'Pantry', rating:4.7, reviews:154, stock:false, qty:0, featured:false, daily:false, desc:'Traditionally sun-dried — deep umami for chammanthi & curry.' },
];

(async () => {
  const batch = db.batch();
  PRODUCTS.forEach(p => batch.set(db.collection('products').doc(p.id), p));
  await batch.commit();
  console.log(`✅ Seeded ${PRODUCTS.length} products into Firestore.`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
