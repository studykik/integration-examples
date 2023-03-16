<script setup>
import StudyKIKSignupWidget from './components/StudyKIK/SignupWidget.vue'
</script>

<script>
export default {
  data() {
    return {
      protocolLandingPageUuid: import.meta.env.VITE_STUDYKIK_PROTOCOL_LANDING_PAGE_UUID,
      signupApi: import.meta.env.VITE_STUDYKIK_SIGNUP_API,
    }
  }

}
</script>
<template>
  <main>
   <!-- StudyKIK Signup Widget Example -->
    <StudyKIKSignupWidget 
      :signup-api="signupApi"
      :protocol-landing-page-uuid="protocolLandingPageUuid" 
    />
  </main>
</template>

<style>
body {
  background-color: #f2f2f2;
  margin: 100px;
}
</style>
