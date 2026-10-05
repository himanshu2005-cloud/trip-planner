/**
 * stopSuggestions.js
 * Curated authentic Indian stops that travelers frequently add to itineraries.
 */

export const POPULAR_STOP_SUGGESTIONS = {
  jaipur: [
    {
      name: 'Rawat Mishthan Bhandar (Pyaaz Kachori & Lassi)',
      category: 'Food Trail',
      duration: 45,
      cost: 180,
      description: 'Iconic Station Road institution renowned for crisp spicy onion kachoris and rich clay-pot lassi.',
    },
    {
      name: 'Anokhi Museum of Hand Printing',
      category: 'Heritage Craft',
      duration: 75,
      cost: 120,
      description: 'Dedicated to the traditional art of block printing inside a restored haveli beneath Amber Fort.',
    },
    {
      name: 'Nahargarh Padao Sunset Viewpoint',
      category: 'Scenic Sunset',
      duration: 90,
      cost: 150,
      description: 'Perched on the Aravalli ridge overlooking the entire glowing pink city as dusk falls.',
    },
    {
      name: 'Bapu Bazaar Lac Bangles & Mojari Market',
      category: 'Local Bazaar',
      duration: 60,
      cost: 0,
      description: 'Lively pink corridors specializing in handmade camel leather mojaris and traditional perfumes.',
    },
  ],
  varanasi: [
    {
      name: 'Blue Lassi Shop (Old City Galis)',
      category: 'Food Trail',
      duration: 35,
      cost: 100,
      description: 'Historic tiny nook near Manikarnika churning hand-whipped fruit and rabri lassis in earthen pots.',
    },
    {
      name: 'Sarnath Deer Park & Dhamek Stupa',
      category: 'Buddhist Heritage',
      duration: 120,
      cost: 50,
      description: 'Sacred grove where Lord Buddha taught his first sermon, featuring Ashoka pillar ruins.',
    },
    {
      name: 'Kashi Chaat Bhandar (Tamatar Chaat)',
      category: 'Street Food',
      duration: 45,
      cost: 120,
      description: 'Legendary Godowlia eatery serving hot spiced tomato chaat and palak patta chaat.',
    },
    {
      name: 'Assi Ghat Subah-e-Banaras Dawn Rituals',
      category: 'Spiritual',
      duration: 75,
      cost: 0,
      description: 'Morning Vedic chanting, classical Shehnai music, and synchronized yoga beside the river.',
    },
  ],
  kerala: [
    {
      name: 'Kashi Art Cafe & Contemporary Gallery',
      category: 'Art Cafe',
      duration: 60,
      cost: 350,
      description: 'Tranquil open-air courtyard in Fort Kochi serving organic roasts and fresh artisanal carrot cake.',
    },
    {
      name: 'Kathakali Performance at Kerala Kalamandalam',
      category: 'Cultural Dance',
      duration: 90,
      cost: 400,
      description: 'Intricate facial makeup demonstration followed by ancient Sanskrit theatre performance.',
    },
    {
      name: 'Spice Plantation Guided Nature Trail',
      category: 'Nature & Spice',
      duration: 80,
      cost: 250,
      description: 'Aromatics tour discovering live green cardamom, black pepper vines, and vanilla pods.',
    },
  ],
  udaipur: [
    {
      name: 'Ambrai Ghat Evening Pichola Panorama',
      category: 'Sunset View',
      duration: 60,
      cost: 0,
      description: 'Direct water-level marble steps facing the illuminated Lake Palace and City Palace facade.',
    },
    {
      name: 'Bagore-ki-Haveli Dharohar Folk Dance',
      category: 'Folk Heritage',
      duration: 75,
      cost: 150,
      description: 'Nightly Rajasthani puppet and pot-balancing dance show in the waterfront haveli courtyard.',
    },
  ],
  ladakh: [
    {
      name: 'Likir Monastery & Giant Buddha Statue',
      category: 'Monastery',
      duration: 90,
      cost: 50,
      description: 'Dramatic 75-foot gilded outdoor Maitreya Buddha overlooking barren snow peaks.',
    },
    {
      name: 'Shanti Stupa Night Stargazing',
      category: 'Scenic Stargazing',
      duration: 60,
      cost: 0,
      description: 'White-domed Buddhist stupa on Changspa hill offering 360-degree views of the Leh valley.',
    },
  ],
};

export const getSuggestionsForDestination = (dest = '') => {
  const lower = dest.toLowerCase();
  if (lower.includes('varanasi') || lower.includes('banaras') || lower.includes('kashi')) {
    return POPULAR_STOP_SUGGESTIONS.varanasi;
  }
  if (lower.includes('kerala') || lower.includes('alleppey') || lower.includes('munnar') || lower.includes('kochi')) {
    return POPULAR_STOP_SUGGESTIONS.kerala;
  }
  if (lower.includes('udaipur')) {
    return POPULAR_STOP_SUGGESTIONS.udaipur;
  }
  if (lower.includes('leh') || lower.includes('ladakh') || lower.includes('nubra')) {
    return POPULAR_STOP_SUGGESTIONS.ladakh;
  }
  return POPULAR_STOP_SUGGESTIONS.jaipur;
};
