import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";

const rpName = "Privacy First Analytics";
const rpID = process.env.NODE_ENV === "production" ? "your-domain.com" : "localhost";
const origin = process.env.NODE_ENV === "production"
  ? "https://your-domain.com"
  : "http://localhost:3000";

export async function generatePasskeyRegistrationOptions(userId: string, userName: string) {
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: userId,
    userName,
    userDisplayName: userName,
    attestationType: "none",
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "preferred",
      residentKey: "required",
    },
  });

  return options;
}

export async function verifyPasskeyRegistration(
  userId: string,
  response: any
) {
  const expectedChallenge = response.challenge; // In production, store and retrieve from session

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  return verification;
}

export async function generatePasskeyAuthenticationOptions() {
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
  });

  return options;
}

export async function verifyPasskeyAuthentication(
  credential: any,
  expectedChallenge: string,
  authenticator: any // From database
) {
  const verification = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialID: authenticator.credentialID,
      credentialPublicKey: authenticator.credentialPublicKey,
      counter: authenticator.counter,
      transports: authenticator.transports,
    },
  });

  return verification;
}