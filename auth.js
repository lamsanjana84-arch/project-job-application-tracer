let loginType = "user";

// ===============================
// SELECT USER / ADMIN LOGIN
// ===============================
function selectLoginType(type) {

    loginType = type;

    const userTab = document.getElementById("userTab");
    const adminTab = document.getElementById("adminTab");
    const loginTitle = document.getElementById("loginTitle");
    const signupArea = document.getElementById("signupArea");

    if (type === "user") {

        userTab.classList.add("active");
        adminTab.classList.remove("active");

        loginTitle.textContent = "User Login";
        signupArea.style.display = "block";

    } else {

        adminTab.classList.add("active");
        userTab.classList.remove("active");

        loginTitle.textContent = "Admin Login";
        signupArea.style.display = "none";
    }
// Clear user credentials when switching to Admin
    if (type === "admin") {

        document.getElementById("loginEmail").value = "";
        document.getElementById("loginPassword").value = "";

        document.getElementById(
            "rememberCredentials"
        ).checked = false;
    }
}




// ===============================
// SHOW SIGNUP
// ===============================
function showSignup() {

    loginType = "user";

    document.getElementById("loginSection").style.display = "none";
    document.getElementById("signupSection").style.display = "block";

    document.getElementById("userTab").classList.add("active");
    document.getElementById("adminTab").classList.remove("active");
}


// ===============================
// SHOW LOGIN
// ===============================
function showLogin() {

    document.getElementById("signupSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";

    selectLoginType("user");
}


// ===============================
// SHOW / HIDE LOGIN PASSWORD
// ===============================
function togglePassword() {

    const password = document.getElementById("loginPassword");
    const button =
        document.querySelector("#loginSection .password-toggle");

    if (password.type === "password") {

        password.type = "text";
        button.textContent = "🙈";

    } else {

        password.type = "password";
        button.textContent = "👁";
    }
}


// ===============================
// SHOW / HIDE SIGNUP PASSWORD
// ===============================
function toggleSignupPassword() {

    const password = document.getElementById("signupPassword");
    const button =
        document.querySelector("#signupSection .password-toggle");

    if (password.type === "password") {

        password.type = "text";
        button.textContent = "🙈";

    } else {

        password.type = "password";
        button.textContent = "👁";
    }
}


// ===============================
// CREATE USER ACCOUNT
// ===============================
document.getElementById("signupForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        const existingUser = users.find(function(user) {
            return user.email.toLowerCase() === email.toLowerCase();
        });

        if (existingUser) {

            alert("This email is already registered!");
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password,
            role: "user"
        };

        users.push(newUser);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert("Account created successfully!");

        document.getElementById("signupForm").reset();

        showLogin();

        document.getElementById("loginEmail").value = email;
    });


// ===============================
// LOGIN
// ===============================
document.getElementById("loginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        // =========================
        // ADMIN LOGIN
        // =========================
        if (loginType === "admin") {

            if (
                email.toLowerCase() === "admin@jobtrack.com" &&
                password === "admin123"
            ) {

                const adminUser = {
                    name: "Administrator",
                    email: "admin@jobtrack.com",
                    role: "admin"
                };

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(adminUser)
                );

                alert("Admin login successful!");

                window.location.href = "admin.html";

            } else {

                alert(
                    "Invalid Admin Login!\n\n" +
                    "Email: admin@jobtrack.com\n" +
                    "Password: admin123"
                );
            }

            return;
        }


        // =========================
        // USER LOGIN
        // =========================
        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(function(user) {

            return (
                user.email.toLowerCase() === email.toLowerCase() &&
                user.password === password
            );

        });

        if (!user) {

            alert("Wrong email or password!");
            return;
        }

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
        );

        alert("User login successful!");

        window.location.href = "index.html";
    });


// ===============================
// REMEMBER LOGIN
// ===============================
window.addEventListener("load", function() {

    const savedEmail =
        localStorage.getItem("rememberedEmail");

    const savedPassword =
        localStorage.getItem("rememberedPassword");

    if (savedEmail && savedPassword) {

        document.getElementById("loginEmail").value =
            savedEmail;

        document.getElementById("loginPassword").value =
            savedPassword;

        document.getElementById("rememberCredentials").checked =
            true;
    }
});