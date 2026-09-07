const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    loginMessage.textContent = "";
    loginMessage.classList.remove("success", "error");

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const loginData = {
        email: email,
        password: password
    };

    fetch("https://final-project-n7u6.onrender.com/Tour-Edo/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);

        if (data.token) {
        localStorage.setItem("token", data.token);
        loginMessage.textContent = data.msg;
        loginMessage.classList.add("success");
    } else {
        loginMessage.textContent = data.msg;
        loginMessage.classList.add("error");
    }
});

});