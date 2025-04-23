import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ListingImage = sequelize.define('ListingImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  listing_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'listings',
      key: 'id'
    }
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'listing_images',
  timestamps: false
});

export default ListingImage; 