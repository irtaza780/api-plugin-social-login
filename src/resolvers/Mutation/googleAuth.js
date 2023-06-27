import { decodeOrderOpaqueId, decodeShopOpaqueId } from "../../xforms/id.js";
import { OAuth2Client } from "google-auth-library";

import ReactionError from "@reactioncommerce/reaction-error";
const client = new OAuth2Client(process.env.Google_Client_Id);
export default async function googleAuth(parent, args, context) {
  const clientId = process.env.Google_Client_Id;
  const { payload } = await client.verifyIdToken({
    idToken: args.idToken,
    audiance: clientId,
  });
  console.log(payload);

}
