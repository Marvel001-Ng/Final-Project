const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');

const store = {
  users: [],
  attractions: [
    {
      id: 'okomu',
      name: 'Okomu National Park',
      category: 'nature',
      location: 'Ovia South-West, Edo State',
      price: 5000,
      rating: 4.8,
      hours: '8:00 AM - 6:00 PM',
      images: [
        'assets/okomu-national-park/sign-from-ticket-office-okomu-national-park-edo.jpg',
        'assets/okomu-national-park/tree-house-okumo-park-edo.jpg'
      ],
      description: 'A rainforest preserve known for wildlife, birdlife, and its remarkable treehouse canopy walk.'
    },
    {
      id: 'ososo',
      name: 'Ososo Hills',
      category: 'adventure',
      location: 'Akoko-Edo, Edo State',
      price: 3500,
      rating: 4.6,
      hours: '7:00 AM - 6:00 PM',
      images: [
        'assets/ososo-hill/ososo-hill-edo.png',
        'assets/ososo-hill/Beautiful_hole_in_the_rock_at_Ososo-edo.jpg'
      ],
      description: 'Dramatic granite peaks and highland views for hiking, climbing, and photography.'
    },
    {
      id: 'ogba',
      name: 'Ogba Zoo & Nature Park',
      category: 'nature',
      location: 'Benin City, Edo State',
      price: 2000,
      rating: 4.7,
      hours: '9:00 AM - 6:00 PM',
      images: ['assets/ogba-zoo/ogba-zoo-and-park.png'],
      description: 'A family-friendly urban nature escape with animals, shaded paths, and picnic spaces.'
    },
    {
      id: 'emowaa',
      name: 'Edo Museum of West African Art',
      category: 'culture',
      location: 'Airport Road, Benin City',
      price: 1500,
      rating: 4.5,
      hours: '10:00 AM - 5:00 PM',
      images: [
        'assets/national-museum-edo/entrance-with-wall-mural.jpg',
        'assets/national-museum-edo/inside-the-exhibit-gallery-national-museum-edo.jpg'
      ],
      description: 'A museum experience connecting Benin history, bronzes, murals, and contemporary West African art.'
    }
  ],
  hotels: [
    { id: 'royal-palms', name: 'Royal Palms Residence', type: 'city', location: 'Benin City', price: 38000, rating: 4.8, image: 'assets/hotel/royal-palms-residence/royal-palms-residence-building.avif' },
    { id: 'greyfield', name: 'Greyfield Hotel & Apartments', type: 'retreat', location: 'Benin City', price: 52000, rating: 4.7, image: 'assets/hotel/greyfield-hotel-and-apartments/greyfield-hotel-and-apartments-building.jpg' },
    { id: 'protea', name: 'Protea Hotel by Marriott', type: 'business', location: 'Benin City', price: 29500, rating: 4.5, image: 'assets/hotel/protea-hotel-by-marriott-benin-city/protea-hotel-by-marriott-building.jpg' },
    { id: 'kawruky', name: 'Kawruky Hotel', type: 'retreat', location: 'Benin City', price: 24000, rating: 4.6, image: 'assets/hotel/kawruky-hotel/kawruky-hotel-building.jpg' }
  ],
  events: [
    { id: 'edo-market', name: 'Edo Food & Craft Market', month: 'september', date: '2026-09-21', category: 'Food & culture', location: 'Benin City', description: 'Meet local makers and taste regional favorites.' },
    { id: 'heritage-week', name: 'Benin Heritage Week', month: 'october', date: '2026-10-12', category: 'Heritage', location: 'Benin City', description: 'A week of stories, music, dance, and living history.' },
    { id: 'ososo-trail', name: 'Ososo Hills Trail Weekend', month: 'october', date: '2026-10-26', category: 'Outdoors', location: 'Akoko-Edo', description: 'A guided climb, highland views, and a slower weekend outdoors.' },
    { id: 'emowaa-voices', name: 'New Voices at EMOWAA', month: 'november', date: '2026-11-08', category: 'Arts', location: 'Benin City', description: 'Emerging West African artists respond to heritage and memory.' }
  ],
  bookings: [],
  reviews: []
};

function findById(collection, id) {
  return store[collection].find((item) => item.id === id);
}

async function ensureAdminAccount() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@touredo.com').trim().toLowerCase();

  if (!store.users.some((user) => user.email === adminEmail)) {
    store.users.push({
      id: crypto.randomUUID(),
      name: 'TourEdo Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeMe123!', 10),
      role: 'admin',
      savedPlaces: []
    });
    console.log(`Development admin ready: ${adminEmail}`);
  }
}

module.exports = { store, findById, ensureAdminAccount };
