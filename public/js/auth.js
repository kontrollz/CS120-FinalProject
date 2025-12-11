// all event handlers for:
// 1. signup.html
// 2. login.html
// 3. forgot_password.html
// 4. reset_password.html

// handle signup
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        // prevent page reload
        e.preventDefault();

        // convert form data to JS object
        const formData = new FormData(signupForm);
        const credentials = Object.fromEntries(formData);

        pass = credentials.password;
        passConf = credentials.passConf;

        // ensure passwords match
        if (pass !== passConf) {
            alert("passwords need to match!");
            signupForm.reset();
            return;
        }

        try {
            // send form data to backend
            const response = await fetch('/signup', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            
            if (data.success) {
                // make form disappear
                const signupCard = document.getElementById('signup-card');
                signupCard.style.display = 'none';

                // make div appear
                const checkEmailDiv = document.getElementById('check-email-card');
                const checkEmailMessage = document.getElementById('check-email-message');
                checkEmailMessage.textContent = `Thank you for signing up! Please check for confirmation 
                                                 link sent to ${credentials.email}`;
                checkEmailDiv.style.display = 'block';

            } else {
                alert(`Signup failed: ${data.message}`);
            }
            
            // reset form
            signupForm.reset();

        } catch (e) {
            console.log(`Error: ${e}`);
            alert("An error occurred, please try again");
        }
    });
}

// handle login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault() // ensure page doesn't reload

        // get form data
        const formData = new FormData(loginForm); 
        const credentials = Object.fromEntries(formData);

        // attempt login w credentials
        try {

            const response = await fetch('/login', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = '/dashboard'
            } else {
                alert(`Login failed: ${data.message}`);
                loginForm.reset();
            }
        

        } catch (e) {
            console.error('Error: ', e);
            alert('An error occurred. Please try again!');
        }

    });
}

// forgot password form
const forgotPasswordForm = document.getElementById('forgot-password-form');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {

        const forgotMsg = document.getElementById("forgot-message");

        e.preventDefault();
        const email = document.getElementById("forgot-email").value.trim();

        try {

            const response = await fetch('/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email})
            });
            
            const data = await response.json();

            if (data.success) {
                forgotPasswordForm.reset();
                forgotMsg.textContent = "If an account with that email exists, a reset link will be sent.";
                forgotMsg.className = "message success";
            } else {
                alert('Could not send email! Try again.');
            }

        } catch (e) {
            alert('Error with backend!');
            console.error("ERROR: ", e);
        }
    });
}

// reset password form
const resetForm = document.getElementById("reset-password-form");
const resetMsg = document.getElementById("reset-message");
if (resetForm) {
    resetForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // get token from url
        const url = window.location.href;
        const token = url.split('/').pop();

        // get password and password confirmation
        const password = document.getElementById("reset-pass").value;
        const confirm = document.getElementById("reset-pass-confirm").value;

        if (password.length < 6) {
            resetMsg.textContent = "Password should be at least 6 characters.";
            resetMsg.className = "message error";
            return;
        }

        if (password !== confirm) {
            resetMsg.textContent = "Passwords do not match.";
            resetMsg.className = "message error";
            return;
        }


        try {

            const response = await fetch('/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password    
                })
            });

            const data = await response.json();

            if (data.success) {
                resetMsg.textContent = "Password updated!";
                resetMsg.className = "message success";
                resetForm.reset();
            } else {
                console.error('ERROR: ', data.error);
                alert('error updating password in database'); // in case token is invalid or user not found
            }

        } catch (e) {
            console.error('ERROR: ', e);
            alert("Error! Try resetting password again.");
        }
    });
}

// dashboard logic
const navBar = document.getElementById('login-nav-bar');
const logoutBtn = document.getElementById('logout-btn');
const greeting = document.getElementById('greeting');

if (navBar) {    
    async function checkForSession() {
        try {
            const response = await fetch('/session');
            const data = await response.json();

            if (data.loggedIn) {
                navBar.style.display = 'none';
                logoutBtn.style.display = 'block';
                greeting.textContent = `Hello, ${data.user.username}!`
            }

        } catch (e) {
            console.log(e);
            alert('there is an error' + e); 
        }
    }

    checkForSession();
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
            });

            const data = await response.json();

            if (data.success) {
                navBar.style.display = 'flex';
                greeting.textContent = '';
                logoutBtn.style.display = 'none';
            } else {
                alert('error logging out! ', data.error);
            }
        } catch (e) {
            console.log('error fetching /logout route: ', e)
            alert('error in backend');
        }
    });
}