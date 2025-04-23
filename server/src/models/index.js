import User from './User.js';
import Category from './Category.js';
import Listing from './Listing.js';
import ListingImage from './ListingImage.js';
import sequelize from '../config/database.js';

// Define relationships
User.hasMany(Listing, { foreignKey: 'seller_id', as: 'listings' });
Listing.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

Category.hasMany(Listing, { foreignKey: 'category_id', as: 'listings' });
Listing.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Listing.hasMany(ListingImage, { foreignKey: 'listing_id', as: 'images' });
ListingImage.belongsTo(Listing, { foreignKey: 'listing_id' });

// Sync all models with database
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
})();

export { User, Category, Listing, ListingImage }; 