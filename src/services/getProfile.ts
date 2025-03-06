
import {
    Args,
    SmartContract,
    DeserializedResult,
  Serializable,
  bytesToStr
    
  } from "@massalabs/massa-web3";

  export class Profile implements Serializable<Profile> {
    constructor(
      public address: string = "",
      public firstName: string = "",
      public lastName: string = "",
      public avatar: string = "",
      public bio: string = "",
      // this will hold the photo URL
      public country: string = "",
      public city: string = "",
      public telegram: string = "",
      public xHandle: string = ""
    ) {}
  
    serialize(): Uint8Array {
      const args = new Args()
        .addString(this.address)
        .addString(this.firstName)
        .addString(this.lastName)
        .addString(this.avatar)
        .addString(this.bio)
        .addString(this.country)
        .addString(this.city)
        .addString(this.telegram)
        .addString(this.xHandle);
  
      return new Uint8Array(args.serialize());
    }
  
    deserialize(data: Uint8Array, offset: number): DeserializedResult<Profile> {
      const args = new Args(data, offset);
  
      this.address = args.nextString();
      this.firstName = args.nextString();
      this.lastName = args.nextString();
      this.avatar = args.nextString();
      this.bio = args.nextString();
      this.country = args.nextString();
      this.city = args.nextString();
      this.telegram = args.nextString();
      this.xHandle = args.nextString();
  
      return { instance: this, offset: args.getOffset() };
    }
  }
  
export async function getContractAddressForUser(address: any,connectedAccount : any){
    const factoryAddress =
    import.meta.env.VITE_FACTORY_ADDRESS ||
    "AS12EyXkBNw1eFmEfS7QQBfZfbdCTq2kRQN1PUe3HREJb3ZF5YocV";
    if (address == undefined){
        return null
    }
  const contract = new SmartContract(connectedAccount, factoryAddress);

  // Build arguments for getUserContract: just the userId.
  const args = new Args().addString(address).serialize();

  // Call the read-only smart contract function "getUserContract".
  const result = await contract.read("getUserContract", args);
  if(result.value.length == 0){
    return null
  }

  const contractAddress = bytesToStr(result.value);
  console.log("............"+contractAddress);
  return contractAddress;
}

export async function getProfile(address : any,profileAddress: any,connectedAccount : any){
   
    const userContract = new SmartContract(
        connectedAccount,
        profileAddress
      );
      
      // Build the arguments for getProfile: pass the user's address.
      const args = new Args().addString(address).serialize();
  
      // Call the smart contract's read-only getProfile function.
      const result = await userContract.read("getProfile", args);
      console.log("getUserContract result:", result.value);
      // If no data is returned, throw an error.
      if (result.value.length === 0) {
        throw new Error("Profile not found");
      }
  
      // Deserialize the result using the Args helper.
      // This assumes your Profile type implements the Serializable interface.
      const deserializedArgs = new Args(result.value);
      const profile = deserializedArgs.nextSerializable<Profile>(Profile);
  
      return profile;
}
const delay = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));

export async function getOwnerOfProfile(profileAddress: any,connectedAccount : any){
   
  const userContract = new SmartContract(
      connectedAccount,
      profileAddress
    );
      console.log("profileAddress result:/*/*/*", userContract);
      await delay(100);
      // Build the arguments for getProfile: pass the user's address.
      const args = new Args();
  
      // Call the smart contract's read-only getProfile function.
      const result = await userContract.read("getOwnerAddress", args);
      console.log("getUserContract result:", result.value);
      // If no data is returned, throw an error.
      if (result.value.length === 0) {
        throw new Error("Profile not found");
      }
  
      // Deserialize the result using the Args helper.
      // This assumes your Profile type implements the Serializable interface.
      const address = bytesToStr(result.value);
      
  
      return address;
    
   
}