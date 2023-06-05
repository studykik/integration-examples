


<script setup>
import { createWidget } from '@typeform/embed'
import '@typeform/embed/build/css/widget.css'
import ThankYou from './ThankYou.vue'
import SignupForm from './SignupForm.vue'

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
            step: 'signup'
        }
    },
    methods: {
        onSignupCompleted(patient) {
            const { questionnaireFormId, uuid } = patient;
            if (!questionnaireFormId) {
                this.step = 'thank-you';
                return;
            }

            this.step = 'form';

            createWidget(questionnaireFormId, {
                container: document.querySelector('#form'),
                height: 520,
                hidden: {
                    patient_uuid: uuid
                },
                onSubmit: (() => {
                    this.step = 'thank-you';
                })
            })
        }
    },
}
</script>

<template>
    <div class="widget-container">
        <div v-show="step === 'signup'">
            <SignupForm @signup-completed="onSignupCompleted" :signupApi="signupApi"
                :protocolLandingPageUuid="protocolLandingPageUuid" />
        </div>
        <div v-show="step === 'form'">
            <div id="form"></div>
        </div>
        <div v-show="step === 'thank-you'">
            <ThankYou />
        </div>
    </div>
</template>

<style scoped>
.widget-container {
    font-family: "Proxima Nova";
    min-width: 240px;
    background: #ffffff;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.07);
    border-radius: 10px;
    min-height: 540px;
    padding: 32px 24px;
}
</style>
