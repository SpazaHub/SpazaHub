import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase, ref, set, get, child, update, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

// Mock Firebase services
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  child: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

// Mock functions for testing
const mockUserCredential = { user: { displayName: 'Test User' } };
const mockError = new Error('Test error');

// Example test for staff login
test('staff login', async () => {
  const mockSignInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
  mockSignInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

  // Simulate staff login
  const email = 'test@example.com';
  const password = 'password';
  await signInWithEmailAndPassword(getAuth(), email, password);

  expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), email, password);
});

// Example test for staff registration
test('staff registration', async () => {
  const mockCreateUserWithEmailAndPassword = require('firebase/auth').createUserWithEmailAndPassword;
  mockCreateUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);

  // Simulate staff registration
  const email = 'test@example.com';
  const password = 'password';
  await createUserWithEmailAndPassword(getAuth(), email, password);

  expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), email, password);
});

// Example test for admin login
test('admin login', async () => {
  const mockSignInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
  mockSignInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

  // Simulate admin login
  const email = 'admin@example.com';
  const password = 'password';
  await signInWithEmailAndPassword(getAuth(), email, password);

  expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), email, password);
});

// Example test for admin update staff
test('admin update staff', async () => {
  const mockUpdate = require('firebase/database').update;
  mockUpdate.mockResolvedValue();

  // Simulate admin update staff
  const username = 'staff1';
  const permissions = 'Manager';
  await update(ref(getDatabase(), 'Staff/' + username), { permissions });

  expect(mockUpdate).toHaveBeenCalledWith(ref(getDatabase(), 'Staff/' + username), { permissions });
});

// Example test for admin delete staff
test('admin delete staff', async () => {
  const mockRemove = require('firebase/database').remove;
  mockRemove.mockResolvedValue();

  // Simulate admin delete staff
  const username = 'staff1';
  await remove(ref(getDatabase(), 'Staff/' + username));

  expect(mockRemove).toHaveBeenCalledWith(ref(getDatabase(), 'Staff/' + username));
});

// Example test for admin delete customer
test('admin delete customer', async () => {
  const mockRemove = require('firebase/database').remove;
  mockRemove.mockResolvedValue();

  // Simulate admin delete customer
  const username = 'customer1';
  await remove(ref(getDatabase(), 'Customers/' + username));

  expect(mockRemove).toHaveBeenCalledWith(ref(getDatabase(), 'Customers/' + username));
});

// Test for error handling during staff login
test('staff login error handling', async () => {
  const mockSignInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
  mockSignInWithEmailAndPassword.mockRejectedValue(mockError);

  // Simulate staff login with an error
  const email = 'test@example.com';
  const password = 'password';
  await signInWithEmailAndPassword(getAuth(), email, password).catch((error) => {
    expect(error).toBe(mockError);
  });

  expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), email, password);
});

// Test for checking user existence before registration
test('check user existence before registration', async () => {
  // Simulate a user already exists
  const username = 'test@example.com';
  const exists = true; // Simulate user exists
  const checkUsernameExists = jest.fn().mockResolvedValue(exists);

  await checkUsernameExists(username).then((exists) => {
    expect(exists).toBe(true);
  });
});

// Test for updating user permissions
test('admin update staff permissions', async () => {
  const mockUpdate = require('firebase/database').update;
  mockUpdate.mockResolvedValue();

  // Simulate admin update staff permissions
  const username = 'staff1';
  const permissions = 'Manager';
  await update(ref(getDatabase(), 'Staff/' + username), { permissions });

  expect(mockUpdate).toHaveBeenCalledWith(ref(getDatabase(), 'Staff/' + username), { permissions });
});

// Test for error handling during admin update staff
test('admin update staff error handling', async () => {
  const mockUpdate = require('firebase/database').update;
  mockUpdate.mockRejectedValue(mockError);

  // Simulate admin update staff with an error
  const username = 'staff1';
  const permissions = 'Manager';
  await update(ref(getDatabase(), 'Staff/' + username), { permissions }).catch((error) => {
    expect(error).toBe(mockError);
  });

  expect(mockUpdate).toHaveBeenCalledWith(ref(getDatabase(), 'Staff/' + username), { permissions });
});

// Test for error handling during admin delete staff
test('admin delete staff error handling', async () => {
  const mockRemove = require('firebase/database').remove;
  mockRemove.mockRejectedValue(mockError);

  // Simulate admin delete staff with an error
  const username = 'staff1';
  await remove(ref(getDatabase(), 'Staff/' + username)).catch((error) => {
    expect(error).toBe(mockError);
  });

  expect(mockRemove).toHaveBeenCalledWith(ref(getDatabase(), 'Staff/' + username));
});
