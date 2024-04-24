



<script setup>
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
defineProps({
    signupApi: {
        type: String,
        required: true
    },
    protocolLandingPageUuid: {
        type: String,
        required: true
    }
})
</script>

<script >
export default {
    data() {
        return {
            fullName: "",
            postalCode: "",
            email: "",
            phone: "",
            country: "us",
            isSubmitting: false,
            validationErrors: {
                fullName: false,
                postalCode: false,
                email: false,
                phone: false,
            },
            serverError: "",
        };
    },
    mounted() {
        const phoneInput = document.getElementById("phone");
        intlTelInput(phoneInput, {
            utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.min.js",
        });
        this.iti = window.intlTelInputGlobals.getInstance(phoneInput);
        const _this = this;

        phoneInput.addEventListener("countrychange", function () {
            const country = _this.iti.getSelectedCountryData().iso2;
            if (!_this.isPhoneValid()) {
                _this.validationErrors.phone = true;
            }
            _this.country = country;
        });
    },
    methods: {
        clearErrors() {
            Object.keys(this.validationErrors).forEach(
                (key) => (this.validationErrors[key] = false)
            );
            this.serverError = "";
        },

        validateFields() {
            let isValid = true;
            if (this.fullName.trim() === "") {
                this.validationErrors.fullName = true;
                isValid = false;
            }

            if (!/^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email)) {
                this.validationErrors.email = true;
                isValid = false;
            }

            if (!this.isPhoneValid()) {
                this.validationErrors.phone = true;
                isValid = false;
            }

            if (this.postalCode.trim() === "") {
                this.validationErrors.postalCode = true;
                isValid = false;
            }
            return isValid;
        },

        isPhoneValid() {
            return this.iti.isValidNumber();
        },

        getFormattedPayload() {
            let timezone = null;
            try {
                timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            } catch (error) {
                console.error("Unable to get user timezone");
            }

            const [firstName, ...lastNames] = this.fullName.split(" ");

            const payload = {
                protocolLandingPageUUID: this.protocolLandingPageUuid,
                firstName,
                lastName: lastNames.join(" "),
                email: this.email,
                phone: this.phone,
                postalCode: this.postalCode,
                timezone,
                country: this.country.toUpperCase(),
            };
            return payload;
        },
        handleRequestError(responseData) {
            if (responseData.errorCode === "invalidPostalCode") {
                this.validationErrors.postalCode = true;
                return;
            }

            const serverErrorCodes = [
                "dailyLimitReached",
                "patientPhoneAlreadyExists",
                "invalidPostalCode",
                "patientAlreadyExistsOnProtocolPage",
                "patientAlreadyExistsOnProtocol"
            ];

            this.serverError =
                (serverErrorCodes.some((code) => code === responseData.errorCode) &&
                    responseData.message) ||
                "Something went wrong. Please try again.";
        },
        async onSubmit() {
            this.clearErrors();

            const validFields = this.validateFields();
            if (!validFields) return;

            const payload = this.getFormattedPayload();

            this.isSubmitting = true;

            try {
                const response = await fetch(`${this.signupApi}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                const responseData = await response.json();
                if (response.ok) {
                    this.$emit("signup-completed", responseData);
                } else {
                    this.handleRequestError(responseData)
                }
            } catch (error) {
                console.error("Unable to signup patient: Err: ", error);
            } finally {
                this.isSubmitting = false;
            }
        },
    },
}
</script>

<template>
    <form @submit.prevent="onSubmit">
        <div class="title-container">
            <h3 class="title">Enter your information to learn more!</h3>
        </div>
        <div v-if="serverError" class="server-error">
            <p class="message">{{ serverError }}</p>
        </div>
        <div class="input-container">
            <label class="input-label" for="full-name">Full Name:</label>
            <input class="input-field" :class="{ error: validationErrors.fullName }" id="full-name" v-model="fullName">
            <p v-show="validationErrors.fullName" class="input-error">Please enter your full name</p>
        </div>
        <div class="input-container">
            <label class="input-label" for="email">Email:</label>
            <input class="input-field" :class="{ error: validationErrors.email }" id="email" v-model="email">
            <p v-show="validationErrors.email" class="input-error">Please make sure your email is the correct</p>
        </div>
        <div class="input-container">
            <label class="input-label" for="phone">Mobile Phone:</label>
            <input class="input-phone-field" :class="{ error: validationErrors.phone }" id="phone" placeholder=""
                v-model="phone">
            <p v-show="validationErrors.phone" class="input-error">Please make sure the phone no. has enough digits</p>
        </div>
        <div class="input-container">
            <label class="input-label" for="postal-code">Postal Code:</label>
            <input class="input-field" :class="{ error: validationErrors.postalCode }" id="postal-code"
                v-model="postalCode">
            <p v-show="validationErrors.postalCode" class="input-error">Please enter a valid postal code</p>
        </div>

        <button class="submit-button" type="submit" :disabled="isSubmitting">
            Learn More
            <div v-if="isSubmitting" id="sign-up-submit-spinner" class="spinner-container">
                <img class="spinner-icon" src="./images/spinner.svg" />
            </div>
        </button>

        <p class="terms-and-conditions">
            By signing up you agree to receive text messages and emails about this and similar studies near you. You can
            unsubscribe at any time. Text messages and data rates may apply. Refer to
            <a target="_blank" href="https://www.studykik.com//privacy-policy">Privacy Policy</a> and
            <a target="_blank" href="https://www.studykik.com/terms-of-service">Terms of Service.</a>
        </p>

        <div class="powered-by-container">
            <p class="title">Powered by</p>
            <img class="studykik-logo" src="./images/studykik-logo.svg" />
        </div>

    </form>
</template>

<style scoped>
.title-container {
    color: #414141;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;

}

.title-container .title {
    color: #414141;
    font-weight: 700;
    font-size: 22px;
    line-height: 22px;
    text-align: center;
    display: inline-block;
}

.server-error {
    color: #a94442;
    background-color: #f2dede;
    width: 100%;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-bottom: 10px;
    border-radius: 4px;
}

.input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
}

.input-container .input-label {
    font-size: 12px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 5px;

}

.input-container .input-field {
    background: #ffffff;
    border: 1px solid #cedbea;
    border-radius: 4px;
    padding: 8px;
    height: 28px;
}

.input-container .input-phone-field {
    width: 100%;
    height: 46px;
    background: #ffffff;
    border: 1px solid #cedbea;
    border-radius: 4px;
}

.input-container .intl-tel-input .error {
    border-color: #FB7272;
}

.input-container .error {
    border-color: #FB7272;
}

.input-container .input-error {
    font-size: 12px;
    color: #FB7272;
    margin: 4px 0 0 0;
}

.submit-button {
    display: block;
    background: #11233e;
    border-radius: 4px;
    width: 100%;
    height: 56px;
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
    font-family: "Proxima Nova";
    margin: 0px 0px 15px 0px;
    border: none;
}

.submit-button:hover {
    cursor: pointer;
}

.submit-button:disabled {
    cursor: not-allowed !important;
}

.submit-button .spinner-container {
    display: inline-block;
    margin-left: 10px;
    position: absolute;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.submit-button .spinner-container .spinner-icon {
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -ms-transform-origin: 50% 50%;
    -webkit-animation: spin 0.7s infinite linear;
    -moz-animation: spin 0.7s infinite linear;
    -ms-animation: spin 0.7s infinite linear;
    animation: spin 0.7s infinite linear;
    margin: 0;
    width: 18px;
    border: none;
    padding: 0;
}

.terms-and-conditions {
    color: #66788A;
    font-size: 12px;
}

.terms-and-conditions a {
    color: #000000;
}

.terms-and-conditions a:visited {
    color: #000000;
}

.powered-by-container {
    display: flex;
    margin: 48px 0px 8px 0px;
    justify-content: center;
    align-items: flex-start;
}

.powered-by-container .title {
    color: #66788A;
    font-size: 12px;
    margin: 0 5px 0 0;

}

.powered-by-container .studykik-logo {
    height: 14px;
}

.iti__flag {
  background-image: url("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/img/flags.png");
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .iti__flag {
    background-image: url("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/img/flags@2x.png");
  }
}
</style>
