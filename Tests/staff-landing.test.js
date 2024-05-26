// staff-landing.test.js

// Import the firebaseMock module
import firebaseMock from './firebaseMock';

// Import functions to be tested
import { displayStockData } from './staff-landing.js';

// Use jest.mock to mock Firebase functions with firebaseMock
jest.mock('firebase/app', () => firebaseMock);

// Mock DOM elements
document.body.innerHTML = `
  <table>
    <tbody id="stockBody"></tbody>
  </table>
`;

describe('displayStockData', () => {
  test('displays stock data in the table body', async () => {
    // Mock data to be returned by Firebase
    const mockSnapshot = {
      forEach: jest.fn((callback) => {
        // Simulate two products
        callback({
          val: () => ({ productName: 'Product 1', price: '$10', quantity: 5 }),
          key: 'product1Key',
        });
        callback({
          val: () => ({ productName: 'Product 2', price: '$20', quantity: 10 }),
          key: 'product2Key',
        });
      }),
    };

    // Mock Firebase functions
    const mockGet = jest.fn(() => Promise.resolve(mockSnapshot));
    const mockDatabase = {
      ref: jest.fn(() => ({ get: mockGet })),
    };
    global.getDatabase.mockReturnValue(mockDatabase);

    // Call the function to be tested
    await displayStockData();

    // Check if the table body contains the expected rows
    const tableBody = document.getElementById('stockBody');
    expect(tableBody.innerHTML).toContain('<td>Product 1</td>');
    expect(tableBody.innerHTML).toContain('<td>$10</td>');
    expect(tableBody.innerHTML).toContain('<td>5</td>');
    expect(tableBody.innerHTML).toContain('<td>Product 2</td>');
    expect(tableBody.innerHTML).toContain('<td>$20</td>');
    expect(tableBody.innerHTML).toContain('<td>10</td>');
  });
});
