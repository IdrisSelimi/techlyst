import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'buyer',
    validate: {
      isIn: [['buyer', 'seller', 'admin']]
    }
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reputation_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      }
    }
  }
});

// Instance method to check password
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

export default User; 