export const isStrongPassword = (password: string): boolean => {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
};
