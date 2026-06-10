import { auth, googleProvider, db } from "@/core/firebase/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const ADMIN_EMAILS = ["admin@bloooms.atelier.com", "admin@bloomatelier.com", "admin@gmail.com", "rinshadcontacts@gmail.com"];

/**
 * Sign up a new user with email, password, and name
 */
export async function signUpWithEmail(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile display name
    await updateProfile(user, { displayName: name });
    
    // Create Firestore document with role
    const isUserAdmin = ADMIN_EMAILS.includes(email);
    await setDoc(doc(db, "users", user.uid), {
      displayName: name || "Studio User",
      email: email,
      role: isUserAdmin ? "admin" : "user",
      createdAt: new Date().toISOString()
    });

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
    
    // Check if user is blocked
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().isBlocked === true) {
      await signOut(auth);
      localStorage.removeItem("user");
      throw new Error("Your account has been blocked by an administrator.");
    }
    
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
    
    // Check if user is blocked
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().isBlocked === true) {
      await signOut(auth);
      localStorage.removeItem("user");
      throw new Error("Your account has been blocked by an administrator.");
    }
    
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

/**
 * Initialize Invisible reCAPTCHA verifier for Phone Auth
 */
export function setUpRecaptcha(containerId) {
  try {
    return new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved
      },
      "expired-callback": () => {
        // reCAPTCHA expired, reset
      }
    });
  } catch (error) {
    console.error("Recaptcha verifier error:", error);
    throw error;
  }
}

/**
 * Send OTP Verification Code to the phone number
 */
export async function sendOtpToPhone(phoneNumber, appVerifier) {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error("SMS OTP request error:", error);
    throw error;
  }
}

/**
 * Verify OTP Code and complete Sign In
 */
export async function verifyOtpCode(confirmationResult, otpCode) {
  try {
    const userCredential = await confirmationResult.confirm(otpCode);
    const user = userCredential.user;
    
    // Check if user is blocked
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().isBlocked === true) {
      await signOut(auth);
      localStorage.removeItem("user");
      throw new Error("Your account has been blocked by an administrator.");
    }
    
    const userData = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "Phone User",
      photoURL: user.photoURL || "",
    };
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error("OTP Verification error:", error);
    throw error;
  }
}
