const fs = require('fs');

const FALLBACKS = {
  'home-hero': '/images/hero-composite.png',
  'home-banner': '/images/AB6AXuBm0DEBZy4ie0uQ.png',
  'home-bulk1': '/images/image 5.png',
  'home-bulk2': '/images/Ice Cream Sundae.png',
  'home-store': '/images/store-interior.png',
  'about-mega': '/images/blank-megaphone.png',
  'about-basket': '/images/grocery-basket.png',
  'about-mission': '/images/mission-composite.png',
  'delivery-map': '/images/tracking-map-bg.png',
  'enquiry-cakes': '/images/shop-cakes.png',
  'products-banner': '/images/AB6AXuBm0DEBZy4ie0uQ.png'
};

for (const val of Object.values(FALLBACKS)) {
  try {
    const buf = fs.readFileSync('public' + val);
    console.log(val, buf.toString('hex', 0, 4));
  } catch (e) {
    console.log(val, "not found");
  }
}
