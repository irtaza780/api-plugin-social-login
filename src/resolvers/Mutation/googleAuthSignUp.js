import { decodeOrderOpaqueId, decodeShopOpaqueId } from "../../xforms/id.js";
import { OAuth2Client } from "google-auth-library";

import ReactionError from "@reactioncommerce/reaction-error";
const client = new OAuth2Client(process.env.Google_Client_Id);
export default async function googleAuthSignUp(parent, args, context) {
  const { collections } = context;
  const { users, Accounts } = collections;

  const clientId = process.env.Google_Client_Id;
  const { payload } = await client.verifyIdToken({
    idToken: args.idToken,
    audiance: clientId,
  });
  if (!args.idToken) {
    throw new ReactionError("not-found", "Not Found");
  }
  console.log(payload);
  if (payload.email_verified) {
    const user = await users.findOne({
      "emails.0.address": payload.email,
    });
    console.log(user);
    if (!user) {
      const account = {
        emails: [
          {
            address: payload.email,
            verified: payload.email_verified,
            provides: "default",
          },
        ],
        name: null,
        profile: {
          firstName: payload.given_name,
          lastName: payload.familyname,
          picture: payload.picture,
          name: payload.name,
        },

        state: "new",
      };
      const accountAdded = await users.insertOne(account);
      const accountAddeds = await Accounts.insertOne(account);
    }
  }

  return {
    message: "signup suceesful",
    success: true,
  };
}
