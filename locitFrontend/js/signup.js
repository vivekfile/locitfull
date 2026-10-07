document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".main-card");
    const registerButton = document.querySelector(".login-button button");
    const errorBox = document.getElementById("signupError");

    if (!registerButton) {
        return;
    }

    registerButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const name = document.querySelector('input[name="name"]')?.value.trim();
        const phone = document.querySelector('input[name="number"]')?.value.trim();
        const email = document.querySelector('input[name="email"]')?.value.trim();
        const password = document.querySelector('input[name="password"]')?.value;
        const confirmPassword = document.querySelector('input[name="cnf-password"]')?.value;
        const role = document.getElementById("signupRole")?.value || "BUYER";
        const termsAccepted = document.querySelector(".remember")?.checked;

        if (!termsAccepted) {
            showSignupError("Please accept the Terms and Conditions.");
            return;
        }

        if (password !== confirmPassword) {
            showSignupError("Passwords do not match.");
            return;
        }

        try {
            const user = await LocitAPI.signup({
                name,
                phone,
                email,
                password,
                role
            });

            saveCurrentUser(user);
            redirectAfterLogin(user);
        } catch (error) {
            showSignupError(error.message);
        }
    });

    function showSignupError(message) {
        if (errorBox) {
            errorBox.textContent = message;
            errorBox.style.display = "block";
            return;
        }

        alert(message);
    }
});
