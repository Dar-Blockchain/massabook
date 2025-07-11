import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  Args,
  SmartContract,
  DeserializedResult,
  Serializable,
  OperationStatus,
  Mas,
  parseMas,
  bytesToStr
} from "@massalabs/massa-web3";
import { calculateStorageCost } from "../../lib/createAccountStorageCost";

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

// export interface ProfileType {
//   address: string;
//   name: string;
//   avatar: string;
//   bio: string;
// }
export class Follow implements Serializable<Follow> {
  constructor(
    public id: bigint = 0n,
    public follower: string = "",
    public followed: string = "",
    public createdAt: bigint = 0n
  ) {}

  serialize(): Uint8Array {
    return new Args()
      .addU64(this.id)
      .addString(this.follower) // Serialize the author's profile
      .addString(this.followed)
      .addU64(this.createdAt)
      .serialize();
  }

  deserialize(data: Uint8Array, offset: number): DeserializedResult<Follow> {
    const args = new Args(data, offset);
    this.id = args.nextU64();
    this.follower = args.nextString();
    this.followed = args.nextString();
    this.createdAt = args.nextU64();

    return { instance: this, offset: args.getOffset() };
  }
}

interface UserState {
  mode: "light" | "dark";
  user: Profile | null;
  posts: Post[];
  friends : Profile[] ;
  friendsposts : Post[];
  userContractAddress: string | undefined;
}

const initialState: UserState = {
  mode: "light",
  user: null,
  posts: [],
  friends: [],
  friendsposts : [],
  userContractAddress: undefined,
};

export const checkUserProfile = createAsyncThunk<
  Profile | null,
  void,
  { state: RootState }
>("user/checkUserProfile", async (_, { getState }) => {
  const state = getState();
  const { currentWallet, connectedAccount } = state.account;
  if (!currentWallet || !connectedAccount) {
    return null;
  }

  try {
    const contractAddress =
      import.meta.env.VITE_FACTORY_ADDRESS ||
      "AS1RcLEVYx3K7NVNpfDQhuzEFmpYEhzu8jpLm5YoWCegBEG8hSsc";
    const args = new Args().addString(connectedAccount.address);
    // const contract = new SmartContract(provider, contractAddress);
    const contract = new SmartContract(connectedAccount, contractAddress);
    const result = await contract.read("getUserContract", args);

    if (result.info.error) {
      console.error("Smart contract error:", result.info.error);
      return null;
    }
    // If no data was returned, profile doesn't exist
    if (result.value.length === 0) {
      console.warn("No profile data returned from contract.");
      return null;
    }

    console.log("result", result);

    const argsForDeserialization = new Args(result.value);
    const profile = argsForDeserialization.nextSerializable<Profile>(Profile);

    console.log("Profile:", profile);

    if (profile.address === "") {
      console.error("Profile is empty after deserialization:", profile);

      return null;
    }

    return profile;
  } catch (error) {
    console.error("Error checking user profile:", error);
    return null;
  }
});

// export const updateUserProfile = createAsyncThunk<
//   Profile,
//   Profile,
//   { state: RootState }
// >("user/updateUserProfile", async (profileData, { getState }) => {
//   const state = getState();
//   const { currentWallet, connectedAccount } = state.account;
//   if (!currentWallet || !connectedAccount) {
//     throw new Error("No provider or connected account");
//   }

//   try {
//     const contractAddress =
//       import.meta.env.VITE_CONTRACT_ADDRESS ||
//       "AS1RcLEVYx3K7NVNpfDQhuzEFmpYEhzu8jpLm5YoWCegBEG8hSsc";
//     const contract = new SmartContract(connectedAccount, contractAddress);

//     const newProfile = new Profile(
//       connectedAccount.address,
//       profileData.name,
//       profileData.avatar,
//       profileData.bio
//     );
//     const args = new Args().addSerializable(newProfile).serialize();

//     const operation = await contract.call("updateProfile", args, {
//       coins: Mas.fromString("3"),
//     });

//     const operationStatus = await operation.waitFinalExecution();
//     if (operationStatus === OperationStatus.Success) {
//       console.log("Profile updated successfully");
//     } else {
//       console.error("Failed to update profile:", operationStatus);
//       throw new Error("Failed to update profile");
//     }
//     return profileData;
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     throw error;
//   }
// });

export const createUserAccount = createAsyncThunk<
  Profile,
  Profile,
  { state: RootState }
>("user/createUserAccount", async (profileData, { getState }) => {
  const state = getState();
  const { currentWallet, connectedAccount } = state.account;
  if (!currentWallet || !connectedAccount) {
    throw new Error("No provider or connected account");
  }
  try {
    // Use the factory contract address (set this in your .env file)
    const factoryAddress =
      import.meta.env.VITE_FACTORY_ADDRESS ||
      "AS12EyXkBNw1eFmEfS7QQBfZfbdCTq2kRQN1PUe3HREJb3ZF5YocV";
    const contract = new SmartContract(connectedAccount, factoryAddress);

    // Use the provided template address for the user contract
    const templateAddress =
      import.meta.env.VITE_TEMPLATE_ADDRESS ||
      "AS1sc86XeQysdTeF3JbqJoyLsbW1ndEzvCfXJ162vXGpBmUG7WVy";

    // Build the arguments for createAccount:
    // [templateAddress, firstName, lastName, bio, photo, country, city, telegram, xHandle]

    const args = new Args()
      .addString(templateAddress)
      .addString(profileData.firstName)
      .addString(profileData.lastName)
      .addString(profileData.bio)
      .addString(profileData.avatar) // photo URL
      .addString(profileData.country)
      .addString(profileData.city)
      .addString(profileData.telegram)
      .addString(profileData.xHandle)
      .addU64(parseMas("5")) // here the cost for the profie
      .serialize();

    const profileKeys = [
      "firstName",
      "lastName",
      "bio",
      "photo",
      "country",
      "city",
      "telegram",
      "xHandle",
    ];
    const storageCost = await calculateStorageCost(profileData, profileKeys);
    console.log("Calculated storage cost:", storageCost);
    const coinsToSend = parseMas(String(storageCost + 7)); // here the cost for the profie and wasm file to deploy

    const operation = await contract.call("createAccount", args, {
      coins: coinsToSend,
    });
    console.log(operation)
    // const operationStatus = await operation.waitSpeculativeExecution();
    // const speculativeEvents = await operation.getSpeculativeEvents();
    // if (operationStatus === OperationStatus.SpeculativeSuccess) {
    //   console.log("User account created successfully");
    // } else {
    //   console.error("Failed to create user account:", speculativeEvents);
    //   throw new Error("Failed to create user account");
    // }
    return profileData;
  } catch (error) {
    console.error("Error creating user account:", error);
    throw error;
  }
});

export const getUserContract = createAsyncThunk<
  string | null,
  string,
  { state: RootState }
>("user/getUserContract", async (userId: string, { getState, dispatch }) => {
  const state = getState();
  const { currentWallet, connectedAccount } = state.account;
  if (!currentWallet || !connectedAccount) {
    throw new Error("No provider or connected account");
  }
  try {
    // Use your factory contract address from your environment variables.
    const factoryAddress =
      import.meta.env.VITE_FACTORY_ADDRESS ||
      "AS12EyXkBNw1eFmEfS7QQBfZfbdCTq2kRQN1PUe3HREJb3ZF5YocV";
    const contract = new SmartContract(connectedAccount, factoryAddress);

    // Build arguments for getUserContract: just the userId.
    const args = new Args().addString(userId).serialize();

    // Call the read-only smart contract function "getUserContract".
    const result = await contract.read("getUserContract", args);
    // If no value was returned, then no contract is deployed yet.
    if (result.value.length === 0) {
      dispatch(setUserContractAddress(undefined));
      return null;
    }

    // Deserialize the returned bytes to extract the contract address.
    // const deserializedArgs = new Args(result.value);
    const contractAddress = bytesToStr(result.value);
    console.log("getUserContract resultmmmmmmmmmmmmmmmmmm"+ contractAddress);

    dispatch(setUserContractAddress(contractAddress));
    return contractAddress;
  } catch (error) {
    console.error("Error getting user contract:", error);
    return null;
  }
});

export const getUserProfile = createAsyncThunk<
  Profile,
  string, // Input argument: the user's address
  { state: RootState }
>("user/getUserProfile", async (userId, { getState }) => {
  const state = getState();
  const { currentWallet, connectedAccount } = state.account;
  const { userContractAddress } = state.user;

  if (!currentWallet || !connectedAccount || !userContractAddress) {
    throw new Error(
      "Missing wallet, connected account, or user contract address"
    );
  }

  try {
    // Create an instance of the user's contract using the stored address.
    
    const userContract = new SmartContract(
      connectedAccount,
      userContractAddress
    );
    console.log("userContract****************", userContractAddress);
    // Build the arguments for getProfile: pass the user's address.
    const args = new Args().addString(userId).serialize();

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
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
});

export const updateProfile = createAsyncThunk<
  Profile, // Returned type on success
  Profile, // Input argument: the updated profile data
  { state: RootState }
>("user/updateProfile", async (profileData, { getState }) => {
  const state = getState();
  const { currentWallet, connectedAccount } = state.account;
  const { userContractAddress } = state.user;

  if (!currentWallet || !connectedAccount || !userContractAddress) {
    throw new Error(
      "Missing wallet, connected account, or user contract address"
    );
  }

  try {
    console.log('Updating profile on blockchain...');
    
    // Create an instance of the user's personal contract.
    const userContract = new SmartContract(
      connectedAccount,
      userContractAddress
    );

    // Create a Profile object with updated information (following testUpdateProfile pattern)
    const updatedProfile = new Profile(
      profileData.address,
      profileData.firstName,
      profileData.lastName,
      profileData.avatar,
      profileData.bio,
      profileData.country,
      profileData.city,
      profileData.telegram,
      profileData.xHandle
    );

    // Build the serialized arguments using the updated Profile data.
    const args = new Args().addSerializable(updatedProfile);

    // Call the on-chain updateProfile function with 0.1 MAS (following testUpdateProfile pattern)
    const operation = await userContract.call("updateProfile", args.serialize(), {
      coins: Mas.fromString("0.1"),
    });

    // Wait until the operation finalizes (using waitFinalExecution like testUpdateProfile)
    const operationStatus = await operation.waitFinalExecution();
    
    if (operationStatus === OperationStatus.Success) {
      console.log('Profile updated successfully on blockchain');
      return profileData;
    } else {
      console.error('Update profile operation failed with status:', operationStatus);
      throw new Error("Failed to update profile on blockchain");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
});

export const createUserPost = createAsyncThunk<
  void,
  { text: string; image: string },
  { state: RootState }
>("user/createPost", async ({ text, image }, { getState }) => {
  const state = getState();
  const { connectedAccount } = state.account;
  const { userContractAddress } = state.user;

  if (!connectedAccount || !userContractAddress) {
    throw new Error("Not connected to wallet or no contract address");
  }

  const contract = new SmartContract(connectedAccount, userContractAddress);
  const args = new Args().addString(text).addString(image).serialize();

  const operation = await contract.call("createPost", args, {
    coins: Mas.fromString("20"),
  });

  const operationStatus = await operation.waitSpeculativeExecution();
  const speculativeEvents = await operation.getSpeculativeEvents();
  if (operationStatus === OperationStatus.SpeculativeSuccess) {
    console.log("User post created successfully");
  } else {
    console.error("Failed to create post:", speculativeEvents);
    throw new Error("Failed to create post");
  }
});

export const fetchUserPosts = createAsyncThunk<
  Post[],
  string,
  { state: RootState }
>("user/fetchPosts", async (userId, { getState }) => {
  const state = getState();
  const { connectedAccount } = state.account;
  const { userContractAddress } = state.user;

  if (!connectedAccount || !userContractAddress) {
    throw new Error("Not connected to wallet or no contract address");
  }

  const contract = new SmartContract(connectedAccount, userContractAddress);
  const args = new Args().addString(userId).serialize();

  const result = await contract.read("getUserPosts", args);
  if (result.info.error) {
    throw new Error(result.info.error);
  }

  const posts = new Args(result.value).nextSerializableObjectArray<Post>(Post);
  console.log("post array from getUserPosts", posts);
  return posts;
});

export const fetchFriendsPosts = createAsyncThunk<
  Post[],
  string,
  { state: RootState }
>("user/fetchFriendsPosts", async (userId, { getState }) => {
  const state = getState();
  const { connectedAccount } = state.account;
  const { userContractAddress } = state.user;

  if (!connectedAccount || !userContractAddress) {
    throw new Error("Not connected to wallet or no contract address");
  }

  const contract = new SmartContract(connectedAccount, userContractAddress);
  const args = new Args().addString(userId).serialize();

  const result = await contract.read("getFollowedProfilesLastPosts", args);
  if (result.info.error) {
    throw new Error(result.info.error);
  }

  const posts = new Args(result.value).nextSerializableObjectArray<Post>(Post);
  console.log("post array from getUserPosts", posts);
  return posts;
});

export const fetchfriendsOfUser = createAsyncThunk<
  Profile[],
  string,
  { state: RootState }
>("user/fetchfriendsOfUser", async (userId, { getState }) => {
  const state = getState();
  const { connectedAccount } = state.account;
  const { userContractAddress } = state.user;

  if (!connectedAccount || !userContractAddress) {
    throw new Error("Not connected to wallet or no contract address");
  }

  const contract = new SmartContract(connectedAccount, userContractAddress);
  const args = new Args().addU64(0n).serialize();

  const result = await contract.read("getFollowedProfiles", args);
  if (result.info.error) {
    throw new Error(result.info.error);
  }
  const Profiles = new Args(result.value).nextSerializableObjectArray<Profile>(Profile);
  console.log("result from getFollowedProfiles"+Profiles)

  return Profiles;
});
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserContractAddress: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.userContractAddress = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(updateUserProfile.fulfilled, (state, action) => {
  //     state.user = action.payload;
  //   });
  //   builder.addCase(checkUserProfile.fulfilled, (state, action) => {
  //     if (action.payload) {
  //       // Profile exists
  //       state.user = action.payload;
  //     } else {
  //       // No profile
  //       state.user = null;
  //     }
  //   });
  // },
  extraReducers: (builder) => {
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    builder.addCase(fetchUserPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      // state.loadingPosts = false;
    });
    builder.addCase(fetchfriendsOfUser.fulfilled, (state, action) => {
      state.friends = action.payload;
      // state.loadingPosts = false;
    });
    builder.addCase(fetchFriendsPosts.fulfilled, (state, action) => {
      state.friendsposts = action.payload;
      // state.loadingPosts = false;
    });
    
  },
});

export const { setMode, setUser, setUserContractAddress } = userSlice.actions;

export default userSlice.reducer;
