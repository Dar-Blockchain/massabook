import { Profile } from "../redux/slices/userSlice";

const WASM_FILE_SIZE = 57344;
export async function calculateStorageCost(
  profileData: Profile,
  profileKeys: string[]
): Promise<number> {
  try {
    // Fetch the template contract's bytecode
    // const bytecode = await fetch('/template.wasm').then((res) => res.arrayBuffer());
    // const bytecodeSize = bytecode.byteLength;

    const bytecodeSize = WASM_FILE_SIZE;
    const initialCost = 0.001;

    const bytecodeCost = bytecodeSize * 0.0001;

    let datastoreTotal = 0;
    for (const key of profileKeys) {
      const value = String(profileData[key as keyof Profile] || "");
      const keyBytes = new TextEncoder().encode(key).length;
      const valueBytes = new TextEncoder().encode(value).length;
      datastoreTotal += 4 + keyBytes + valueBytes;
    }
    const datastoreCost = datastoreTotal * 0.0001;
    // Total storage cost
    const totalCost = initialCost + bytecodeCost + datastoreCost;
    const buffer = 0.001;
    return totalCost + buffer + 15;
  } catch (error) {
    console.error("Error calculating storage cost:", error);
    throw error;
  }
}
