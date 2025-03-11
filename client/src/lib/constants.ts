export const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  "https://images.unsplash.com/photo-1556228578-567ba127e37f",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
  "https://images.unsplash.com/photo-1697301439922-4e686fbb302f",
  "https://images.unsplash.com/photo-1730794545099-14902983739d",
  "https://images.unsplash.com/photo-1730993872148-83acdfb597e8",
];

export const getRandomImage = () => 
  PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
