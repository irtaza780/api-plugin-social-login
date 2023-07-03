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
      FB.api('me', { fields: ['name', 'email'], access_token: args.accessToken }, (response) => {
        if (!response || response.error) {
          console.log(response.error);
          reject(new Error('Facebook login failed.'));
        } else {
          const { name, email } = response;
          // Handle the user creation or retrieval logic here
          // Resolve with the user data
          resolve({ id: 'USER_ID', name, email });
        }
         console.log(response, "new response");
      });
     
    });
  
 
}
