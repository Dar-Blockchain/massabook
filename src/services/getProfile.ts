import {
    Args,
    SmartContract,
    DeserializedResult,
  Serializable,
  bytesToStr,
  Mas,
  OperationStatus,
  ArrayTypes,
  Operation
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
      public id: bigint = 0n, // Use bigint to handle u64 values in JavaScript
      public author: string = '', // Address serialized as string
      public authorName: string = '',
      public authorAvatar: string = '',
      public text: string = '',
      public image: string = '',
      public isRepost: boolean = false,
      public repostedPostId: bigint = 0n, // Use bigint for u64 values
      public createdAt: bigint = 0n, // Use bigint for timestamp
      public likesNbr: bigint = 0n, // Use bigint for u64 values
      public commentNbr: bigint = 0n, // Use bigint for u64 values
    ) {}
  
    // Serialize the Post object for sending to the backend
    serialize(): Uint8Array {
      const args = new Args()
        .addU64(this.id)
        .addString(this.author) // Author as a string
        .addString(this.authorName)
        .addString(this.authorAvatar)
        .addString(this.text)
        .addString(this.image)
        .addBool(this.isRepost)
        .addU64(this.repostedPostId)
        .addU64(this.createdAt)
        .addU64(this.likesNbr)
        .addU64(this.commentNbr);
  
      return new Uint8Array(args.serialize());
    }
  
    // Deserialize the data received from the backend
    deserialize(data: Uint8Array, offset: number): DeserializedResult<Post> {
      const args = new Args(data, offset);
  
      this.id = args.nextU64(); // Deserialize id as bigint
      this.author = args.nextString(); // Deserialize author
      this.authorName = args.nextString(); // Deserialize authorName
      this.authorAvatar = args.nextString(); // Deserialize authorAvatar
      this.text = args.nextString(); // Deserialize text
      this.image = args.nextString(); // Deserialize image
      this.isRepost = args.nextBool(); // Deserialize isRepost
      this.repostedPostId = args.nextU64(); // Deserialize repostedPostId as bigint
      this.createdAt = args.nextU64(); // Deserialize createdAt as bigint
      this.likesNbr = args.nextU64(); // Deserialize likesNbr as bigint
      this.commentNbr = args.nextU64(); // Deserialize commentNbr as bigint
  
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
        .addString(this.commenterName)
        .addString(this.commenterAvatar)
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
      this.commenterName = args.nextString(); // Deserialize commenterName
      this.commenterAvatar = args.nextString(); // Deserialize commenterAvatar
      this.text = args.nextString(); // Deserialize text
      this.createdAt = args.nextU64(); // Deserialize createdAt
      this.parentId = args.nextU64(); // Deserialize parentId
      this.commenterName = args.nextString(); // Deserialize commenterName
      this.commenterAvatar = args.nextString(); // Deserialize commenterAvatar
  
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
   
    try {
      console.log('Adding comment through factory contract...');
      
      // Get the factory contract address
      const factoryAddress = import.meta.env.VITE_FACTORY_ADDRESS ||
        "AS12EyXkBNw1eFmEfS7QQBfZfbdCTq2kRQN1PUe3HREJb3ZF5YocV";
      
      const factoryContract = new SmartContract(
        connectedAccount,
        factoryAddress
      );
      
      // Use the factory contract pattern - simpler arguments
      const args = new Args()
        .addU64(BigInt(postID))
        .addString(text)
        .addString(ownerComment) // postAuthorAddress
        .addString(connectedAccount.address); // commenterAddress
      
      const operation = await factoryContract.call('addPostComment', args.serialize(), {
        coins: Mas.fromString('0.1'),
      });
      
      const operationStatus = await operation.waitFinalExecution();
      console.log('Factory comment operation:', operation);
      
      if (operationStatus === OperationStatus.Success) {
        console.log('Factory comment added successfully');
        return true;
      } else {
        console.error('Factory add comment operation failed with status:', operationStatus);
        return false;
      }
    } catch (error) {
      console.error('Error adding comment through factory:', error);
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
  console.log('Getting comments through factory for post ID:', postId, 'by author:', ownerComment);
  
    // Get the factory contract address
    const factoryAddress = import.meta.env.VITE_FACTORY_ADDRESS ||
      "AS12EyXkBNw1eFmEfS7QQBfZfbdCTq2kRQN1PUe3HREJb3ZF5YocV";
    const factoryContract = new SmartContract(
      connectedAccount,
      factoryAddress
    );
    
    // Use the factory contract pattern
    const args = new Args()
      .addString(ownerComment) // postAuthorAddress
      .addU64(BigInt(postId)); // postId
    
    const result = await factoryContract.read('getPostComments', args.serialize());

    // Check if there's any data returned
    if (result.info.error) {
      throw new Error(result.info.error);
    }
  

      const deserializedComments = new Args(
        result.value,
      ).nextSerializableObjectArray<Comment>(Comment);
      
      console.log('Factory Post Comments:', deserializedComments);
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

// Test function for updating profile on blockchain (reference implementation)
export async function testUpdateProfile(
  contract: SmartContract,
  address: string,
  firstName: string,
  lastName: string,
  bio: string,
  avatar: string,
  country: string,
  city: string,
  telegram: string,
  xHandle: string
): Promise<boolean> {
  console.log('Testing updateProfile...');
  
  // Create a Profile object with updated information
  const updatedProfile = new Profile(
    address,
    firstName,
    lastName,
    avatar,
    bio,
    country,
    city,
    telegram,
    xHandle
  );

  const args = new Args().addSerializable(updatedProfile);
  
  const operation: Operation = await contract.call('updateProfile', args.serialize(), {
    coins: Mas.fromString('0.1'),
  });
  
  const operationStatus = await operation.waitFinalExecution();
  
  if (operationStatus === OperationStatus.Success) {
    console.log('Profile updated successfully');
    return true;
  } else {
    console.error('Update profile operation failed with status:', operationStatus);
    return false;
  }
}

// Factory contract test functions (reference implementations)
export async function testFactoryAddComment(
  factoryContract: SmartContract,
  postId: bigint,
  text: string,
  postAuthorAddress: string,
  commenterAddress: string
): Promise<boolean> {
  console.log('Testing factory addPostComment...');
  
  const args = new Args()
    .addU64(postId)
    .addString(text)
    .addString(postAuthorAddress)
    .addString(commenterAddress);
  
  const operation: Operation = await factoryContract.call('addPostComment', args.serialize(), {
    coins: Mas.fromString('0.1'),
  });
  
  const operationStatus = await operation.waitFinalExecution();
  
  if (operationStatus === OperationStatus.Success) {
    console.log('Factory comment added successfully');
    return true;
  } else {
    console.error('Factory add comment operation failed with status:', operationStatus);
    return false;
  }
}

export async function getFactoryPostComments(connectedAccount: any,  postAuthorAddress: string,
  postId: bigint
) {
  console.log('Getting comments through factory for post ID:', postId, 'by author:', postAuthorAddress);
  const factoryAddress =
    import.meta.env.VITE_FACTORY_ADDRESS
  console.log("factoryAddress",factoryAddress)
  const factoryContract = new SmartContract(connectedAccount, factoryAddress);
  const args = new Args()
    .addString(postAuthorAddress)
    .addU64(postId);
  
  const result = await factoryContract.read('getPostComments', args.serialize());

  const deserializedComments = new Args(
    result.value,
  ).nextSerializableObjectArray<Comment>(Comment);

  console.log('Factory Post Comments:', deserializedComments);
  return deserializedComments;
}

export async function testDeletePost(
  connectedAccount: any,
  postId: bigint
): Promise<boolean> {
  console.log('Testing deletePost for post ID:', postId);
  
  const profile1Address = await getContractAddressForUser(connectedAccount.address, connectedAccount);
  
  if (!profile1Address) {
    console.error('Profile address not found');
    return false;
  }
  
  const cont1 = new SmartContract(connectedAccount, profile1Address);
  
  const args = new Args().addU64(postId);
  
  const operation: Operation = await cont1.call('deletePost', args.serialize(), {
    coins: Mas.fromString('0.1'),
  });
  
  console.log('Delete operation ID:', operation.id);
  const operationStatus = await operation.waitFinalExecution();
  
  if (operationStatus === OperationStatus.Success) {
    console.log('DeletePost executed successfully');
    return true;
  } else {
    console.error('DeletePost operation failed with status:', operationStatus);
    return false;
  }
}