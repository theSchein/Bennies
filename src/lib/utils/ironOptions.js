// lib/utils/ironOptions.js

export const ironOptions = {
    cookieName: "siwe_session_cookie",
    password: process.env.SESSION_SECRET,  // Ensure this is at least 32 characters long
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  };