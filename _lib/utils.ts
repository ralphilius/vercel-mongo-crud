export const isValidJson = (json: string): boolean => {
  try {
    JSON.parse(json);
  } catch (error) {
    return false;
  }
  return true;
}