import { auth, googleProvider } from "@/core/firebase/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile 
} from "firebase/auth";

/**
 * Sign up a new user with email, password, and name
 */
export async function signUpWithEmail(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile display name
    await updateProfile(user, { displayName: name });
    
    // Save user object to localStorage for sync with UI navbar
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: user.photoURL,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
}

/**
 * Log in a user with email and password
 */
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "User",
      photoURL: user.photoURL,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Log in a user using Google OAuth pop-up
 */
export async function loginWithGoogle() {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Google User",
      photoURL: user.photoURL,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}

/**
 * Log out the current user
 */
export async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}
