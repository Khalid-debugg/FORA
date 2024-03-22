import { INewUser } from "@/types";
import { ID } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";

export async function createUser(user: INewUser) {
  try {
    const newUser = await account.create(
      ID.unique(),
      user.email,
      user.password,
    );
    const avatarURL = avatars.getInitials();
    return await createNewUserDocument({
      accountID: newUser.$id,
      email: user.email,
      username: user.username,
      imageURL: avatarURL,
    });
  } catch (error) {
    return error;
  }
}

export async function createNewUserDocument(user: {
  accountID: string;
  email: string;
  username: string;
  imageURL: URL;
}) {
  try {
    const document = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersID,
      ID.unique(),
      user,
    );
    return document;
  } catch (err) {
    console.log(err);
    return err;
  }
}
// export async function createLoginSession(user: IRegisteredUser) {
//   try {
//     const newUser = await account.createEmailPasswordSession(
//       user.email,
//       user.password,
//     );
//     return newUser;
//   } catch (err) {
//     console.log(err);
//     return err;
//   }
// }
// export async function verifyUser() {
//   try {
//     const promise = await account.createVerification(
//       "http://localhost:5173/verify",
//     );
//     return promise;
//   } catch (err) {
//     console.log(err);
//   }
// }
// export async function updateUserVerification(userId: string, secret: string) {
//   try {
//     const promise = account.updateVerification(userId, secret);
//     return promise;
//   } catch (err) {
//     console.log(err);
//   }
// }
