const AUTH_STORAGE_KEY = "locitUser";

function getCurrentUser() {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
}

function saveCurrentUser(user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

function requireAuth(redirectTo = "/auth/login.html") {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = redirectTo;
        return null;
    }

    return user;
}

function redirectAfterLogin(user) {
    if (user.role === "SELLER") {
        window.location.href = "/seller-page/seller-dashboard.html";
        return;
    }

    window.location.href = "/main/mainpage.html";
}

function updateAccountLabel() {
    const user = getCurrentUser();
    const profileName = document.querySelector(".profile-name");

    if (profileName && user) {
        profileName.textContent = user.name.split(" ")[0];
    }
}
