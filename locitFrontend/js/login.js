document.addEventListener("DOMContentLoaded", () => {
    const existingUser = getCurrentUser();

    if (existingUser) {
        redirectAfterLogin(existingUser);
        return;
    }

    const identifierInput = document.querySelector(".phone-email-input input");
    const passwordInput = document.querySelector(".password-input input");
    const loginButton = document.querySelector(".login-button-btn");
    const errorBox = document.getElementById("loginError");

    if (!loginButton) {
        return;
    }

    loginButton.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            const user = await LocitAPI.login(
                identifierInput.value.trim(),
                passwordInput.value
            );

            saveCurrentUser(user);
            redirectAfterLogin(user);
        } catch (error) {
            if (errorBox) {
                errorBox.textContent = error.message;
                errorBox.style.display = "block";
            } else {
                alert(error.message);
            }
        }
    });
});
