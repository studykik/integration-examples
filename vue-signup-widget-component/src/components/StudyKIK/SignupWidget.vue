


<script setup>
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
            isCompleted: false
        }
    },
    methods: {
        onSignupCompleted() {
            this.isCompleted = true
        }
    }
}
</script>

<template>
    <div class="widget-container">
        <div v-if="isCompleted">
            <ThankYou />
        </div>
        <div v-else>
            <SignupForm @signup-completed="onSignupCompleted" :signupApi="signupApi"
                :protocolLandingPageUuid="protocolLandingPageUuid" />
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
