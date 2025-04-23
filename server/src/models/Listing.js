import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  condition: {
    type: DataTypes.STRING,
    validate: {
      isIn: [['new', 'used']]
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'hidden', 'expired']]
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  contact_info: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  postal_code: {
    type: DataTypes.STRING
  },
  specs: {
    type: DataTypes.JSONB
  },
  expires_at: {
    type: DataTypes.DATE
  },
  renewed_at: {
    type: DataTypes.DATE
  },
  is_flagged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'listings',
  timestamps: false
});

export default Listing; 