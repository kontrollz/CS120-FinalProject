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
                alert(data.message);
            } else {
                alert("Signup failed: " + data.message);
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
                window.location.href = '/'
            } else {
                alert('Login failed: ' + data.message);
                loginForm.reset();
            }
        

        } catch (e) {
            console.error('Error: ' + e);
            alert('An error occurred. Please try again!');
        }

    });
}

const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = '/login';
            } else {
                alert('error logging out! ', data.error);
            }
        } catch (e) {
            console.log('error fetching /logout route: ', e)
            alert('error in backend');
        }
    });
}