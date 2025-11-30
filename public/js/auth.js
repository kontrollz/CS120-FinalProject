// all event handlers for:
// 1. signup.html
// 2. login.html
// 3. forgot_password.html
// 4. reset_password.html


// handle signup
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', async (e) => {
    // prevent page reload
    e.preventDefault();

    // convert form data to JS object
    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData);

    // send form data to backend

});
