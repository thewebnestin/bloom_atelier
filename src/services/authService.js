import { auth, googleProvider } from "@/core/firebase/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  signInWithPhoneNumber,
  RecaptchaVerifier
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
