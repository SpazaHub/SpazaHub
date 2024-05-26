const initializeApp = jest.fn();
const getAuth = jest.fn();
const getDatabase = jest.fn();
const ref = jest.fn();
const set = jest.fn();
const get = jest.fn();
const child = jest.fn();
const update = jest.fn();
const remove = jest.fn();
const signInWithEmailAndPassword = jest.fn();
const createUserWithEmailAndPassword = jest.fn();
const signOut = jest.fn();
const sendPasswordResetEmail = jest.fn();

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
  sendPasswordResetEmail,
};
