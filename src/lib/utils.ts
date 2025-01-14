export const shortenAddress = (address: string, chars = 10): string => {
  if (!address) return ""; // Return empty string if no address is provided
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};
