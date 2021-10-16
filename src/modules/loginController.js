
import appData from "./appData";

const LoginConstants = {
    CLIENT_AUTH_TYPE_NONE: 0,
    CLIENT_AUTH_TYPE_PASSWORD: 1,
    CLIENT_AUTH_TYPE_BIOMETRICOTP: 2,
    CLIENT_AUTH_TYPE_PASSWORD_AND_BIOMETRICOTP: 3,
    CLIENT_AUTH_TYPE_PASSWORD_OR_BIOMETRICOTP: 4,

    SECOND_AUTH_METOD_BIOMETRIC: 1,
    SECOND_AUTH_METOD_OTP: 2,
    SECOND_AUTH_METOD_BIOMETRIC_OR_OTP: 3,

    AUTH_PREFERENCE_UNKNOWN: 0,
    AUTH_PREFERENCE_BIOMETRIC: 1,
    AUTH_PREFERENCE_OTP: 2,
    AUTH_PREFERENCE_PASSWORD: 3,

    OTP_TYPE_TOTP: 0,
    OTP_TYPE_SMS: 1,
}

/**
 * Main class for Nubo authntication logic
 */
class LoginController {

    /**
     * The method open the next authentication step according to the
     * Nubo client authentication process and the current step
     */
    nuboAuthProcess(caller) {
        console.log('nuboAuthProcess');

        // Indicate if all required auth process completed and we can move forward to start session
        let authComplete = false;
        if (appData.clientauthtype == LoginConstants.CLIENT_AUTH_TYPE_PASSWORD) {
            if (appData.passwordValidated) {
                authComplete = true;
            } else {
                if (this.tryPassword(caller)) {
                    return true;
                }
            }
        } else if (appData.clientauthtype == LoginConstants.CLIENT_AUTH_TYPE_BIOMETRICOTP) {
            if (appData.biometricValidated) {
                authComplete = true;
            } else {
                if (this.tryBiometricOTPAuth(caller)) {
                    return true;
                }
            }
        } else if (appData.clientauthtype == LoginConstants.CLIENT_AUTH_TYPE_PASSWORD_AND_BIOMETRICOTP) {
            if (appData.passwordValidated && appData.biometricValidated) {
                authComplete = true;
            } else {
                if (!appData.passwordValidated) {
                    if (this.tryPassword(caller)) {
                        return true;
                    }
                }
                if (this.tryBiometricOTPAuth(caller)) {
                    return true;
                }
            }
        } else if (appData.clientauthtype == LoginConstants.CLIENT_AUTH_TYPE_PASSWORD_OR_BIOMETRICOTP) {
            if (appData.passwordValidated || appData.biometricValidated) {
                authComplete = true;
            } else {
                if (appData.authUserPreference != LoginConstants.AUTH_PREFERENCE_PASSWORD) {
                    if (this.tryBiometricOTPAuth(caller)) {
                        return true;
                    }
                }
                if (this.tryPassword(caller)) {
                    return true;
                }
            }
        } else {
            authComplete = true;
        }

        appData.authComplete = true;
        if (authComplete) {
            caller.$router.push("/Client");
            return true;
        } else {
            caller.$router.push("/Splash");
            return false;
        }
    }

    tryPassword(caller) {
        caller.$router.push("/Password");
        return true;
    }

    tryBiometricOTPAuth() {
        return false;
    }

    /**
     * @type {LoginController}
     */
    static instance = new LoginController()
    static LoginConstants = LoginConstants;

}

//const loginControllerInstance = new LoginController();
//loginControllerInstance
export default LoginController;