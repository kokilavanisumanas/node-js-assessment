const { check, validationResult } = require('express-validator');

// Validation rules for creating a product
const validateProduct = [
    check('name').isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters'),
    check('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    check('description').isLength({ max: 500 }).optional().withMessage('Description cannot exceed 500 characters'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateProduct, validate };
