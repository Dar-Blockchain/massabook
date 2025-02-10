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

// export interface ProfileType {
//   address: string;
//   name: string;
//   avatar: string;
//   bio: string;
// }
interface UserState {
  mode: "light" | "dark";
  user: Profile | null;
  userContractAddress: string | undefined;
}

const initialState: UserState = {
  mode: "light",
  user: null,
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
      import.meta.env.VITE_CONTRACT_ADDRESS ||
      "AS1RcLEVYx3K7NVNpfDQhuzEFmpYEhzu8jpLm5YoWCegBEG8hSsc";
    const args = new Args().addString(connectedAccount.address);
    // const contract = new SmartContract(provider, contractAddress);
    const contract = new SmartContract(connectedAccount, contractAddress);
    const result = await contract.read("getProfile", args);

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
      "AS1eK1Xd8gGzsrMWHLghkpZabs7XwkB5PoxkENzBbi1iJSoa3VZy";
    const contract = new SmartContract(connectedAccount, factoryAddress);

    // Use the provided template address for the user contract
    const templateAddress =
      "AS12SHo1uVJgE8WctUBuZkbeiz84FMALvHnVXV2yvHxsDj2Gf3jjr";

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
    const coinsToSend = parseMas(String(storageCost + 7));

    const operation = await contract.call("createAccount", args, {
      coins: coinsToSend,
    });
    const operationStatus = await operation.waitSpeculativeExecution();
    const speculativeEvents = await operation.getSpeculativeEvents();
    if (operationStatus === OperationStatus.SpeculativeSuccess) {
      console.log("User account created successfully");
    } else {
      console.error("Failed to create user account:", speculativeEvents);
      throw new Error("Failed to create user account");
    }
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
      "AS127thiEuVbfTgKhqR47Z9VKsXubDu6cXZgrXrjrYu9UCE5XQwbn";
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
    const deserializedArgs = new Args(result.value);
    const contractAddress = deserializedArgs.nextString();
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

    // Build the arguments for getProfile: pass the user's address.
    const args = new Args().addString(userId).serialize();

    // Call the smart contract's read-only getProfile function.
    const result = await userContract.read("getProfile", args);

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
    // Create an instance of the user's personal contract.
    const userContract = new SmartContract(
      connectedAccount,
      userContractAddress
    );

    // Build the serialized arguments using the updated Profile data.
    // This assumes your Profile class implements the Serializable interface.
    const args = new Args().addSerializable(profileData).serialize();

    // Call the on-chain updateProfile function.
    // (Here, we attach 0 coins assuming the update does not require payment.)
    const operation = await userContract.call("updateProfile", args, {
      coins: Mas.fromString("0"),
    });

    // Wait until the operation finalizes.
    const operationStatus = await operation.waitSpeculativeExecution();
    const speculativeEvents = await operation.getSpeculativeEvents();
    if (operationStatus === OperationStatus.SpeculativeSuccess) {
      console.log("User profile updated successfully");
    } else {
      console.error("Failed to update user profile:", speculativeEvents);
      throw new Error("Failed to update user profile");
    }

    // If successful, return the updated profile.
    return profileData;
  } catch (error) {
    console.error("Error updating profile:", error);

    throw error;
  }
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
  },
});

export const { setMode, setUser, setUserContractAddress } = userSlice.actions;

export default userSlice.reducer;
