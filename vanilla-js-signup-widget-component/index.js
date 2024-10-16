const SK_API_URL = "";
const SIGN_UP_UUID = ""; 

const validationErrors = {
  fullName: false,
  email: false,
  postalCode: false,
  phone: false,
};

const payload = {
  fullName: '',
  email: '',
  phone: '',
  country: 'us',
  postalCode: '',
};

let serverError = '';

const phoneInput = document.querySelector('#phone');
const submitButton = document.querySelector('.submit-button');

const iti = intlTelInput(phoneInput, {
  initialCountry: 'us',
  utilsScript:
    'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.min.js',
});

const updateShowErrors = () => {
  const keys = Object.keys(validationErrors);
  keys.forEach((key) => {
    if (validationErrors[key]) {
      document.querySelector(`#${key}`).classList.add('error');
      document.querySelector(`.${key}-error`).classList.remove('hidden');
    } else {
      document.querySelector(`#${key}`).classList.remove('error');
      document.querySelector(`.${key}-error`).classList.add('hidden');
    }
  });
};

const validateField = (field) => {
  let isValid = true;
  switch (field) {
    case 'fullName':
      if (payload.fullName.trim() === '') {
        validationErrors.fullName = true;
        isValid = false;
      } else {
        validationErrors.fullName = false;
      }
      break;
    case 'email':
      if (!/^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/.test(payload.email)) {
        validationErrors.email = true;
        isValid = false;
      } else {
        validationErrors.email = false;
      }
      break;
    case 'postalCode':
      if (payload.postalCode.trim() === '') {
        validationErrors.postalCode = true;
        isValid = false;
      } else {
        validationErrors.postalCode = false;
      }
      break;
    case 'phone':
      if (!iti.isValidNumber()) {
        validationErrors.phone = true;
        isValid = false;
      } else {
        validationErrors.phone = false;
      }
      break;
  }

  return isValid;
};

const validateFields = (fieldToValidate = 'all') => {
  let isValid = true;
  if (fieldToValidate === 'all') {
    isValid = Object.keys(payload).reduce((acc, key) => {
      return acc && validateField(key);
    }, true);
  } else {
    isValid = validateField(fieldToValidate);
  }

  updateShowErrors();
  return isValid;
};

const clearErrors = () => {
  Object.keys(validationErrors).forEach(
    (key) => (validationErrors[key] = false)
  );
  serverError = '';
};

const getFormattedPayload = () => {
  let timezone = null;
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Unable to get user timezone');
  }

  const [firstName, ...lastNames] = payload.fullName.split(' ');

  const formattedPayload = {
    protocolLandingPageUUID: SIGN_UP_UUID,
    firstName,
    lastName: lastNames.join(' '),
    email: payload.email,
    phone: payload.phone,
    postalCode: payload.postalCode,
    timezone,
    country: payload.country.toUpperCase(),
  };
  return formattedPayload;
};

const handleRequestError = (responseData) => {
  if (responseData.errorCode === 'invalidPostalCode') {
    validationErrors.postalCode = true;
    return;
  }

  const serverErrorCodes = [
    'dailyLimitReached',
    'patientPhoneAlreadyExists',
    'invalidPostalCode',
    'patientAlreadyExistsOnProtocolPage',
    'patientAlreadyExistsOnProtocol',
  ];

  serverError =
    (serverErrorCodes.some((code) => code === responseData.errorCode) &&
      responseData.message) ||
    'Something went wrong. Please try again.';
  document.querySelector('.server-error').classList.remove('hidden');
  document.querySelector('#serverError').textContent = serverError;
};

const handleIsSubmitting = (isSubmitting) => {
  submitButton.disabled = isSubmitting;
  if (isSubmitting) {
    document.querySelector('.server-error').classList.add('hidden');
    document
      .querySelector('#sign-up-submit-spinner')
      .classList.remove('hidden');
  } else {
    document.querySelector('#sign-up-submit-spinner').classList.add('hidden');
  }
};

document.querySelector('form').addEventListener(
  'submit',
  async function (e) {
    e.preventDefault();
    clearErrors();
    const isFormValid = validateFields();
    if (!isFormValid) {
      return;
    }

    const formattedPayload = getFormattedPayload();
    handleIsSubmitting(true);

    try {
      const response = await fetch(`${SK_API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedPayload),
      });
      const responseData = await response.json();
      if (response.ok) {
        const { questionnaireFormId, uuid } = responseData;
        if (!questionnaireFormId) {
          document.querySelector('.form-container').classList.add('hidden');
          document.querySelector('.thank-you').classList.remove('hidden');
          return;
        }
        window.location.href = `https://studykik.com/study-survey/${questionnaireFormId}/${uuid}`;
      } else {
        handleRequestError(responseData);
      }
    } catch (error) {
      console.error('Unable to signup patient: Err: ', error);
    } finally {
      handleIsSubmitting(false);
    }
  },
  false
);

phoneInput.addEventListener('countrychange', function () {
  const country = iti.getSelectedCountryData().iso2;
  const num = iti.getNumber();
  payload.country = country;
  payload.phone = num;
  validateFields();
});

phoneInput.addEventListener('input', function () {
  const num = iti.getNumber();
  payload.phone = num;
  validateFields('phone');
});

document.querySelectorAll('.input-field').forEach((input) => {
  input.addEventListener('input', function (e) {
    const { id, value } = e.target;
    if (id === 'phone') {
      return;
    }
    payload[id] = value.trim();
    validationErrors[id] = false;
    validateFields(id);
  });
});
