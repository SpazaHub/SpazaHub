// Import the functions to test from customer-cart.js
import { searchForProduct, displayAllProducts, addToCart, displayCart, removeFromCart } from './customer-cart.js';

// Mock products data for testing
const mockProducts = [
  { productName: 'Product 1', description: 'Description 1', price: '$10', imageUrl: 'path/to/image1.jpg' },
  { productName: 'Product 2', description: 'Description 2', price: '$20', imageUrl: 'path/to/image2.jpg' },
];

// Mock getElementById and addEventListener
document.getElementById = jest.fn().mockReturnValue({
    addEventListener: jest.fn(),
    value: '', // Mock the value property of the input element
  });
  
  describe('searchForProduct', () => {
    test('searches for product based on search term', () => {
      const filteredProducts = searchForProduct(mockProducts, 'Product 1');
      expect(filteredProducts.length).toBe(1);
      expect(filteredProducts[0].productName).toBe('Product 1');
    });
  
    test('returns all products if search term is empty', () => {
      const allProducts = searchForProduct(mockProducts, '');
      expect(allProducts).toEqual(mockProducts);
    });
  });
  

describe('displayAllProducts', () => {
  test('displays all products', () => {
    // Mock root element
    document.body.innerHTML = '<div id="root"></div>';
    displayAllProducts(mockProducts);
    expect(document.querySelectorAll('.box').length).toBe(mockProducts.length);
  });
});

describe('addToCart and displayCart', () => {
  beforeEach(() => {
    // Clear cart before each test
    cart = [];
    document.body.innerHTML = '<div id="cartItem"></div>';
  });

  test('adds product to cart and displays cart', () => {
    addToCart(0); // Add the first product to cart
    displayCart();
    expect(cart.length).toBe(1);
    expect(document.querySelectorAll('.cart-item').length).toBe(1);
  });

  test('removes product from cart and updates cart display', () => {
    addToCart(0); // Add a product to cart
    addToCart(1); // Add another product to cart
    displayCart(); // Display the cart
    const removeButtons = document.querySelectorAll('.remove-from-cart');
    removeButtons[0].click(); // Click on remove button for the first product
    expect(cart.length).toBe(1); // Cart should contain only one product
    expect(document.querySelectorAll('.cart-item').length).toBe(1); // Only one item should be displayed in the cart
  });
});

describe('removeFromCart', () => {
  test('removes product from cart', () => {
    // Add some products to the cart
    cart.push(mockProducts[0], mockProducts[1], mockProducts[2]);
    // Remove a product from the cart
    removeFromCart(1); // Remove the second product
    // Expect the cart to have two products after removal
    expect(cart.length).toBe(2);
    // Expect the remaining products to be in correct order
    expect(cart[0].productName).toBe('Product 1');
    expect(cart[1].productName).toBe('Product 3');
  });
});
