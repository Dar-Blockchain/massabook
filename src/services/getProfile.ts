
import {
    Args,
    SmartContract,
    DeserializedResult,
  Serializable,
  bytesToStr,
  Mas,
  OperationStatus,
  ArrayTypes
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

export class Comment implements Serializable<Comment> {
  constructor(
    public id: bigint = 0n, // Use bigint for u64 values
    public postId: bigint = 0n, // postId as bigint
    public commenter: string = '', // Address serialized as string
    public commenterName: string = '',
    public commenterAvatar: string = '',
    public text: string = '',
    public createdAt: bigint = 0n, // createdAt as bigint
    public parentId: bigint = 0n, // parentId as bigint
  ) {}

  // Serialize the Comment object
  serialize(): Uint8Array {
    const args = new Args()
      .addU64(this.id)
      .addU64(this.postId)
      .addString(this.commenter) // Address as string
      .addString(this.text)
      .addU64(this.createdAt)
      .addU64(this.parentId)
      .addString(this.commenterName)
      .addString(this.commenterAvatar)
      ;

    return new Uint8Array(args.serialize());
  }

  // Deserialize the Comment object
  deserialize(data: Uint8Array, offset: number): DeserializedResult<Comment> {
    const args = new Args(data, offset);

    this.id = args.nextU64(); // Deserialize id
    this.postId = args.nextU64(); // Deserialize postId
    this.commenter = args.nextString(); // Deserialize commenter
    this.text = args.nextString(); // Deserialize text
    this.createdAt = args.nextU64(); // Deserialize createdAt
    this.parentId = args.nextU64(); // Deserialize parentId
    this.commenterName = args.nextString(); // Deserialize commenterName
    this.commenterAvatar = args.nextString(); // Deserialize commenterAvatar

    return { instance: this, offset: args.getOffset() };
  }
  }

  export class Like implements Serializable<Like> {
    constructor(
      public id: bigint = 0n, // Use bigint for u64 values
      public userAddress: string = '', // postId as bigint
      public postId: bigint = 0n, // Address serialized as string
      public createdAt: bigint = 0n, // createdAt as bigint
     
    ) {}
  
    // Serialize the Comment object
    serialize(): Uint8Array {
      const args = new Args()
        .addU64(this.id)
        .addString(this.userAddress) 
        .addU64(this.postId)
        .addU64(this.createdAt)
  
      return new Uint8Array(args.serialize());
    }
  
    // Deserialize the Comment object
    deserialize(data: Uint8Array, offset: number): DeserializedResult<Like> {
      const args = new Args(data, offset);
  
      this.id = args.nextU64(); 
      this.userAddress = args.nextString(); 
      this.postId = args.nextU64(); // Deserialize postId
      this.createdAt = args.nextU64(); // Deserialize createdAt
  
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
  const factoryAddress =
  import.meta.env.VITE_FACTORY_ADDRESS 
  const userContract = new SmartContract(
      connectedAccount,
      factoryAddress
    );
    const operation = await userContract.call(
      'following',
      new Args().addString(connectedAccount.address).addString(followUserAddress).serialize(),
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

export async function commentPost(connectedAccount : any,ownerComment: any,text:any,postID:any){
   
 
    const userProfile:any = await getContractAddressForUser(ownerComment,connectedAccount);
    const commenterProfile:any = await getContractAddressForUser(connectedAccount.address,connectedAccount);

    const userContract = new SmartContract(
      connectedAccount,
      userProfile
    );
    const operation = await userContract.call(
      'addPostComment',
      new Args().addU64(postID).addString(text).addString(commenterProfile).serialize(),
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
export async function likePost(connectedAccount : any,ownerComment: any,postID:any){
   
 
  const userProfile:any = await getContractAddressForUser(ownerComment,connectedAccount);
  const userContract = new SmartContract(
    connectedAccount,
    userProfile
  );
  const operation = await userContract.call(
    'likePost',
    new Args().addU64(postID).addString(connectedAccount.address).serialize(),
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

export async function getPostComments(connectedAccount : any,ownerComment: any, postId: any) {
  const userProfile:any = await getContractAddressForUser(ownerComment,connectedAccount);
  console.log(`Getting address ${userProfile} comments`);
  const userContract = new SmartContract(
    connectedAccount,
    userProfile
  );
  const result = await userContract.read(
    'getPostComments',
    new Args().addU64(postId).serialize(),
  );

  const deserializedComments = new Args(
    result.value,
  ).nextSerializableObjectArray<Comment>(Comment);
  
  console.log(`Post ${postId} comments :`, deserializedComments);
  return deserializedComments;
}

export async function getFollowersNBR(connectedAccount : any,userAddress: any) {
  const factoryAddress =
    import.meta.env.VITE_FACTORY_ADDRESS 
  const userContract = new SmartContract(
    connectedAccount,
    factoryAddress
  );
  const result = await userContract.read(
    'getFollowers',
    new Args().addString(userAddress).serialize(),
  );

  const nbFollowers = new Args(
    result.value,
  ).nextU64();
  
  console.log(`****** ${connectedAccount.address} ***** :`, nbFollowers.toString());
  return nbFollowers;
}
export async function getLikesofPost(connectedAccount : any,ownerComment: any, postId: any) {
  const userProfile:any = await getContractAddressForUser(ownerComment,connectedAccount);
  console.log(`Getting address ${userProfile} comments`);
  const userContract = new SmartContract(
    connectedAccount,
    userProfile
  );
  const result = await userContract.read(
    'getPostLikedUsers',
    new Args().addU64(postId).serialize(),
  );
console.log(result.value)
const deserializedUsers = new Args(result.value).nextArray<string>(
  ArrayTypes.STRING,
);

  console.log(`Like of post ${postId} comments :`, deserializedUsers);
  return deserializedUsers;
}