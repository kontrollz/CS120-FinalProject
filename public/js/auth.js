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
    const credentials = Object.fromEntries(formData);
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
