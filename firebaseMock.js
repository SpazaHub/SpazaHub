// firebaseMock.js
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
  

  module.exports = {
    initializeApp,
    getAuth,
    getDatabase,
    ref,
    set,
    get,
    child,
    update,
    remove,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
  };