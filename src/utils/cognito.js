import {
  CognitoIdentityProviderClient,
  SignUpCommand,  
  ConfirmSignUpCommand, 
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-2",
});

const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;

export const signUpUser = async (email, password, profile_name) => {
  try {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: profile_name },
      ]
    });

    const response = await cognitoClient.send(command);
    return { success: true, sub: response.UserSub  };
    
  } catch (err) {
    if (err.name === "UsernameExistsException") {
      return { success: false, error: "Email already in use" };
    }
  }
};

export const handleForgotPassword = async (email) => {
  try {
    const params = {
      ClientId: CLIENT_ID,
      Username: email,
    };

    const command = new ForgotPasswordCommand(params);
    const response = await cognitoClient.send(command);

    console.log("Code sent:", response);
    return { success: true };
  } catch (err) {
    if (
      err.name === "InvalidParameterException" &&
      err.message.includes("no registered/verified email or phone_number")
    ) {
      console.warn("Cannot reset password: No verified email or phone number.");
      return {
        success: false,
        error: "Cannot reset password because your account has no verified email or phone number. Please contact support."
      };
    }

    console.error("Forgot password error:", err);
    return { success: false, error: err.message };
  }
};

export const handleConfirmForgotPassword = async (
  email,
  code,
  newPassword
) => {
  try {
    const params = {
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    };

    const command = new ConfirmForgotPasswordCommand(params);
    const response = await cognitoClient.send(command);

    console.log("Password reset success:", response);
    return { success: true };
  } catch (err) {
    console.error("Confirm password error:", err);
    return { success: false, error: err.message };
  }
};

export const handleConfirmUser = async (email, code) => {
  try {
    const params = {
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    };

    const command = new ConfirmSignUpCommand(params);
    const response = await cognitoClient.send(command);

    console.log("User confirmed:", response);
    return { success: true }; 
  } catch (err) {
    if (
      err.name === "NotAuthorizedException" &&
      err.message.includes("Current status is CONFIRMED")
    ) {
      console.log("User already confirmed. Proceed to login.");
      return { success: true, alreadyConfirmed: true };
    }

    console.error("Confirm user error:", err);
    return { success: false, error: err.message }; 
  }
};


export const handleResendConfirmationCode = async (email) => {
  try {
    const command = new ResendConfirmationCodeCommand({
      ClientId: CLIENT_ID,
      Username: email,
    });

    const response = await cognitoClient.send(command);
    console.log("Confirmation code resent:", response);
    return { success: true };
  } catch (err) {
    console.error("Resend code error:", err);
    return { success: false, error: err.message };
  }
};

