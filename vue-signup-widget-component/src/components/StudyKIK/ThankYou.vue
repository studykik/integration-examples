<template>
  <div class="title-container">
    <h3 class="title">Thank you for your interest in this research study!</h3>
  </div>
  <p class="next-steps-title"> What Happens Next? </p>

  <div class="next-step-container">
    <img class="next-step-icon" src="./images/next-step-icon.svg" />
    <div>
      <h3 class="title">Check your text messages.</h3>
      <p class="text">You will receive a text message to schedule a good time to talk.</p>
    </div>
  </div>
  <div class="next-step-container">
    <img class="next-step-icon" src="./images/next-step-icon.svg" />
    <div>
      <h3 class="title">An expert will contact you.</h3>
      <p class="text">A qualified specialist will see if you're a good match for the study.</p>
    </div>
  </div>
  <div class="next-step-container">
    <img class="next-step-icon" src="./images/next-step-icon.svg" />
    <div>
      <h3 class="title">We'll connect you with a specialist.</h3>
      <p class="text">If you're a match, we will get you in touch with the closest doctor's office involved in this
        study.</p>
    </div>
  </div>
</template>

<style scoped>
.title-container {
  color: #414141;
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
}

.title-container .title {
  color: #414141;
  font-weight: 700;
  font-size: 22px;
  line-height: 22px;
  text-align: center;
  display: inline-block;
}

.next-steps-title {
  color: #11233E;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 24px;

}

.next-step-container {
  background-color: #DFFBF8;
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  padding: 16px;
  margin-bottom: 25px;
}

.next-step-container .next-step-icon {
  margin-right: 12px;
}

.next-step-container .title {
  color: #11233E;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
  margin: 0px 0px 12px 0px;

}

.next-step-container .text {
  color: #333333;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
</style>
