import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';

export const login = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const register = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const formatUser = (firebaseUser: FirebaseUser) => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || undefined,
  };
};

