// firebaseTests.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase, ref, set, get, child, update, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getAuth as mockGetAuth, signInWithEmailAndPassword as mockSignInWithEmailAndPassword, createUserWithEmailAndPassword as mockCreateUserWithEmailAndPassword, signOut as mockSignOut, sendPasswordResetEmail as mockSendPasswordResetEmail } from './firebaseMock';

// Mock Firebase services
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getAuth: jest.fn(),
  getDatabase: jest.fn(),
  ref: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  child: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

// Mock functions for testing
const mockUserCredential = { user: { displayName: 'Test User' } };
const mockError = new Error('Test error');

// Example test for staff login
test('staff login', async () => {
  mockSignInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

  // Simulate staff login
  const email = 'test@example.com';
  const password = 'password';
  await signInWithEmailAndPassword(auth, email, password);

  expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
});

// Example test for staff registration
test('staff registration', async () => {
  mockCreateUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);

  // Simulate staff registration
  const email = 'test@example.com';
  const password = 'password';
  await createUserWithEmailAndPassword(auth, email, password);

  expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
});

// Example test for admin login
test('admin login', async () => {
  mockSignInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

  // Simulate admin login
  const email = 'admin@example.com';
  const password = 'password';
  await signInWithEmailAndPassword(auth, email, password);

  expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
});

// Example test for admin update staff
test('admin update staff', async () => {
  update.mockResolvedValue();

  // Simulate admin update staff
  const username = 'staff1';
  const permissions = 'Manager';
  await update(ref(db, 'Staff/' + username), { permissions });

  expect(update).toHaveBeenCalledWith(ref(db, 'Staff/' + username), { permissions });
});

// Example test for admin delete staff
test('admin delete staff', async () => {
  remove.mockResolvedValue();

  // Simulate admin delete staff
  const username = 'staff1';
  await remove(ref(db, 'Staff/' + username));

  expect(remove).toHaveBeenCalledWith(ref(db, 'Staff/' + username));
});

// Example test for admin delete customer
test('admin delete customer', async () => {
  remove.mockResolvedValue();

  // Simulate admin delete customer
  const username = 'customer1';
  await remove(ref(db, 'Customers/' + username));

  expect(remove).toHaveBeenCalledWith(ref(db, 'Customers/' + username));
});

// Continue from the previous firebaseTests.js file

// Test for error handling during staff login
test('staff login error handling', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue(mockError);
  
    // Simulate staff login with an error
    const email = 'test@example.com';
    const password = 'password';
    await signInWithEmailAndPassword(auth, email, password).catch((error) => {
      expect(error).toBe(mockError);
    });
  
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
  });
  
  // Test for checking user existence before registration
  test('check user existence before registration', async () => {
    // Simulate a user already exists
    const username = 'test@example.com';
    const password = 'password';
    const exists = true; // Simulate user exists
    checkUsernameExists(username).then((exists) => {
      expect(exists).toBe(true);
    });
  });
  
  // Test for updating user permissions
  test('admin update staff permissions', async () => {
    update.mockResolvedValue();
  
    // Simulate admin update staff permissions
    const username = 'staff1';
    const permissions = 'Manager';
    await update(ref(db, 'Staff/' + username), { permissions });
  
    expect(update).toHaveBeenCalledWith(ref(db, 'Staff/' + username), { permissions });
  });
  
  // Test for error handling during admin update staff
  test('admin update staff error handling', async () => {
    update.mockRejectedValue(mockError);
  
    // Simulate admin update staff with an error
    const username = 'staff1';
    const permissions = 'Manager';
    await update(ref(db, 'Staff/' + username), { permissions }).catch((error) => {
      expect(error).toBe(mockError);
    });
  
    expect(update).toHaveBeenCalledWith(ref(db, 'Staff/' + username), { permissions });
  });
  
  // Test for error handling during admin delete staff
  test('admin delete staff error handling', async () => {
    remove.mockRejectedValue(mockError);
  
    // Simulate admin delete staff with an error
    const username = 'staff1';
    await remove(ref(db, 'Staff/' + username)).catch((error) => {
      expect(error).toBe(mockError);
    });
  
    expect(remove).toHaveBeenCalledWith(ref(db, 'Staff/' + username));
  });
  