
import {
    Args,
    SmartContract,
    DeserializedResult,
  Serializable,
  bytesToStr,
  Mas,
  OperationStatus
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
        .addString(this.bio)
        .addString(this.avatar)
        
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
      this.bio = args.nextString();
      this.avatar = args.nextString();
      
      this.country = args.nextString();
      this.city = args.nextString();
      this.telegram = args.nextString();
      this.xHandle = args.nextString();
  
      return { instance: this, offset: args.getOffset() };
    }
  }
  export class Post implements Serializable<Post> {
    constructor(
      public id: bigint = 0n,
      public author: string = "",
      public authorName: string = '',
      public authorAvatar: string = '',
      public text: string = "",
      public image: string = "",
      public isRepost: boolean = false,
      public repostedPostId: bigint = 0n,
      public createdAt: bigint = 0n
    ) {}
  
    serialize(): Uint8Array {
      return new Args()
        .addU64(this.id)
        .addString(this.author) // Serialize the author's profile
        .addString(this.authorName)
        .addString(this.authorAvatar)
        .addString(this.text)
        .addString(this.image)
        .addBool(this.isRepost)
        .addU64(this.repostedPostId)
        .addU64(this.createdAt)
        .serialize();
    }
  
    deserialize(data: Uint8Array, offset: number): DeserializedResult<Post> {
      const args = new Args(data, offset);
      this.id = args.nextU64();
      this.author = args.nextString();
      this.authorName = args.nextString();
      this.authorAvatar = args.nextString();
      this.text = args.nextString();
      this.image = args.nextString();
      this.isRepost = args.nextBool();
      this.repostedPostId = args.nextU64();
      this.createdAt = args.nextU64();
  
      return { instance: this, offset: args.getOffset() };
    }
  }
export async function getContractAddressForUser(address: any,connectedAccount : any){
  console.log(connectedAccount,"zzzzzzz")
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
export async function getUserPosts(userAddress : any,profileAddress: any,connectedAccount : any){
   const contract = new SmartContract(connectedAccount, profileAddress);
    const args = new Args().addString(userAddress).serialize();
  
    const result = await contract.read("getUserPosts", args);
    if (result.info.error) {
      throw new Error(result.info.error);
    }
  
    const posts = new Args(result.value).nextSerializableObjectArray<Post>(Post);
    console.log("post array from getUserPosts", posts);
    return posts;
}

export async function followProfile(profileAddress: any,connectedAccount : any,followUserAddress: any){
   
  const userContract = new SmartContract(
      connectedAccount,
      profileAddress
    );
    const userProfile:any = await getContractAddressForUser(followUserAddress,connectedAccount);
    const operation = await userContract.call(
      'followProfile',
      new Args().addString(userProfile).addString(followUserAddress).serialize(),
      {
        coins: Mas.fromString('0.02'),
      },
    );
    const operationStatus = await operation.waitFinalExecution();
    console.log('Operation :'+operation)
    if (operationStatus === OperationStatus.Success) {
      console.log('User followed successfully');
      return true;
    } else {
      console.error('Operation failed with status:', operationStatus);
      return false;
    }
    
   
}