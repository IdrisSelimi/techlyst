import { Category } from '../models/index.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const categoryExists = await Category.findOne({ where: { slug } });

    if (categoryExists) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    const category = await Category.create({
      name,
      slug
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (category) {
      // Check if new slug already exists
      if (slug && slug !== category.slug) {
        const slugExists = await Category.findOne({ where: { slug } });
        if (slugExists) {
          return res.status(400).json({ message: 'Category with this slug already exists' });
        }
      }

      category.name = name || category.name;
      category.slug = slug || category.slug;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (category) {
      await category.destroy();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 