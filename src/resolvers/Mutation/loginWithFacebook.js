import { decodeOrderOpaqueId, decodeShopOpaqueId } from "../../xforms/id.js";
import { OAuth2Client } from "google-auth-library";
import FB from "fb";
import ReactionError from "@reactioncommerce/reaction-error";
const client = new OAuth2Client(process.env.Google_Client_Id);

export default async function loginWithFacebook(parent, args, context) {
  const { collections } = context;
  const { users, Accounts } = collections;
  const appId = "537507555260101";
  const appSecret = "cc45e53c030ecf1e07e58b98e1c0cb0c";

  return new Promise((resolve, reject) => {
    FB.api(
      "me",
      {
        fields: ["name", "email", "picture"],
        access_token: args.accessToken,
      },
      async (response) => {
        if (!response || response.error) {
          console.log(response.error);
          reject(new Error("Facebook login failed."));
        } else {
          const { name, email, picture } = response;

          if (response.email) {
            const user = await users.findOne({
              "emails.0.address": response.email,
            });
            console.log(user);
            if (!user) {
              const account = {
                emails: [
                  {
                    address: response.email,
                    verified: response.email_verified,
                    provides: "default",
                  },
                ],
                name: response.name,
                profile: {
                  firstName: response.name,
                  picture: response.picture.url,
                  name: response.name,
                },
                state: "new",
              };
              const accountAdded = await users.insertOne(account);
              const accountAddeds = await Accounts.insertOne(account);

              resolve({
                message: "login successful",
                success: true,
              });
            }
          }

          resolve({ id: "USER_ID", name, email, picture });
        }
      }
    );
  });
}