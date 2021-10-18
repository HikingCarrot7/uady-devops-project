export const serializeError = <T>(error: T | T[]) => {
  if (Array.isArray(error)) {
    return { errors: error };
  }

  return { error: error };
};
