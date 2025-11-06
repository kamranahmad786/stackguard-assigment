import bcrypt from "bcryptjs";

/**
 * Hash a plain text string (e.g. password or key)
 */
export const hash = async (value) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(value, salt);
};

/**
 * Compare plain text vs hashed string
 */
export const compare = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};
