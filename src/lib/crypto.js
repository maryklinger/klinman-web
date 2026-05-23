import bcrypt from 'bcryptjs';

export async function compararContrasena(password, hash) {
  return await bcrypt.compare(password, hash);
}