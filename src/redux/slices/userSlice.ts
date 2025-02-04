import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  Args,
  SmartContract,
  DeserializedResult,
  Serializable,
  OperationStatus,
  Mas,
} from "@massalabs/massa-web3";

export class Profile implements Serializable<Profile> {
  constructor(
    public address: string = "",
    public name: string = "",
    public avatar: string = "",
    public bio: string = ""
  ) {}

  serialize(): Uint8Array {
    const args = new Args()
      .addString(this.address)
      .addString(this.name)
      .addString(this.avatar)
      .addString(this.bio);

    return new Uint8Array(args.serialize());
  }

  deserialize(data: Uint8Array, offset: number): DeserializedResult<Profile> {
    const args = new Args(data, offset);

    this.address = args.nextString();
    this.name = args.nextString();
    this.avatar = args.nextString();
    this.bio = args.nextString();

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
}

const initialState: UserState = {
  mode: "light",
  user: null,
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

export const updateUserProfile = createAsyncThunk<
  Profile,
  Profile,
  { state: RootState }
>("user/updateUserProfile", async (profileData, { getState }) => {
  const state = getState();
  const { currentWallet, connectedAccount } = state.account;
  if (!currentWallet || !connectedAccount) {
    throw new Error("No provider or connected account");
  }

  try {
    const contractAddress =
      import.meta.env.VITE_CONTRACT_ADDRESS ||
      "AS1RcLEVYx3K7NVNpfDQhuzEFmpYEhzu8jpLm5YoWCegBEG8hSsc";
    const contract = new SmartContract(connectedAccount, contractAddress);

    const newProfile = new Profile(
      connectedAccount.address,
      profileData.name,
      profileData.avatar,
      profileData.bio
    );
    const args = new Args().addSerializable(newProfile).serialize();

    const operation = await contract.call("updateProfile", args, {
      coins: Mas.fromString("3"),
    });

    const operationStatus = await operation.waitFinalExecution();
    if (operationStatus === OperationStatus.Success) {
      console.log("Profile updated successfully");
    } else {
      console.error("Failed to update profile:", operationStatus);
      throw new Error("Failed to update profile");
    }
    return profileData;
  } catch (error) {
    console.error("Error updating user profile:", error);
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
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(checkUserProfile.fulfilled, (state, action) => {
      if (action.payload) {
        // Profile exists
        state.user = action.payload;
      } else {
        // No profile
        state.user = null;
      }
    });
  },
});

export const { setMode, setUser } = userSlice.actions;

export default userSlice.reducer;
