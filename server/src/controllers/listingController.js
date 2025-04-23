import { Listing, ListingImage, Category, User } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
export const getListings = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    
    // Build filter object
    const filter = {
      status: 'active',
      is_approved: true
    };

    // Additional filters
    if (req.query.category) {
      const category = await Category.findOne({ where: { slug: req.query.category } });
      if (category) {
        filter.category_id = category.id;
      }
    }

    if (req.query.condition) {
      filter.condition = req.query.condition;
    }

    if (req.query.min_price && req.query.max_price) {
      filter.price = {
        [Op.between]: [req.query.min_price, req.query.max_price]
      };
    } else if (req.query.min_price) {
      filter.price = {
        [Op.gte]: req.query.min_price
      };
    } else if (req.query.max_price) {
      filter.price = {
        [Op.lte]: req.query.max_price
      };
    }

    // Search query
    if (req.query.search) {
      filter[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }

    const count = await Listing.count({ where: filter });
    
    const listings = await Listing.findAll({
      where: filter,
      include: [
        {
          model: ListingImage,
          as: 'images',
          attributes: ['id', 'url', 'is_primary']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'reputation_score']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: pageSize,
      offset: pageSize * (page - 1)
    });

    res.json({
      listings,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get listing by ID
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [
        {
          model: ListingImage,
          as: 'images',
          attributes: ['id', 'url', 'is_primary']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'reputation_score', 'is_verified']
        }
      ]
    });

    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private/Seller
export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      condition,
      category_id,
      contact_info,
      country,
      city,
      postal_code,
      specs
    } = req.body;

    const listing = await Listing.create({
      title,
      description,
      price,
      condition,
      category_id,
      seller_id: req.user.id,
      contact_info,
      country,
      city,
      postal_code,
      specs: specs ? JSON.parse(specs) : {},
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private/Seller
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if the user is the owner of the listing
    if (listing.seller_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized' });
    }

    const {
      title,
      description,
      price,
      condition,
      category_id,
      contact_info,
      country,
      city,
      postal_code,
      status,
      specs
    } = req.body;

    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.condition = condition || listing.condition;
    listing.category_id = category_id || listing.category_id;
    listing.contact_info = contact_info || listing.contact_info;
    listing.country = country || listing.country;
    listing.city = city || listing.city;
    listing.postal_code = postal_code || listing.postal_code;
    listing.status = status || listing.status;
    
    if (specs) {
      listing.specs = typeof specs === 'string' ? JSON.parse(specs) : specs;
    }

    // Reset expiration if updating an expired listing
    if (listing.status === 'expired' && status === 'active') {
      listing.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      listing.renewed_at = new Date();
    }

    const updatedListing = await listing.save();
    res.json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private/Seller
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if the user is the owner of the listing
    if (listing.seller_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await listing.destroy();
    res.json({ message: 'Listing removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload listing images
// @route   POST /api/listings/:id/images
// @access  Private/Seller
export const uploadListingImages = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if the user is the owner of the listing
    if (listing.seller_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized' });
    }

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Get existing images count
    const existingImagesCount = await ListingImage.count({
      where: { listing_id: listing.id }
    });

    // Limit to maximum 8 images per listing
    if (existingImagesCount + req.files.length > 8) {
      return res.status(400).json({ message: 'Maximum 8 images per listing allowed' });
    }

    const images = [];
    
    // Process each uploaded file
    for (const file of req.files) {
      const isPrimary = existingImagesCount === 0 && images.length === 0;
      
      const image = await ListingImage.create({
        listing_id: listing.id,
        url: `/uploads/${file.filename}`,
        is_primary: isPrimary
      });
      
      images.push(image);
    }

    res.status(201).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get listings by seller
// @route   GET /api/listings/seller/:id
// @access  Public
export const getListingsBySeller = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    
    const filter = {
      seller_id: req.params.id,
      status: 'active',
      is_approved: true
    };
    
    const count = await Listing.count({ where: filter });
    
    const listings = await Listing.findAll({
      where: filter,
      include: [
        {
          model: ListingImage,
          as: 'images',
          attributes: ['id', 'url', 'is_primary']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: pageSize,
      offset: pageSize * (page - 1)
    });

    res.json({
      listings,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 