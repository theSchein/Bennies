// lib/auth.js
// This file contains functions for hashing and verifying passwords.
// Needs review to see if this is still used.

import { hash, compare } from "bcryptjs";

export async function hashPassword(password) {
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}
