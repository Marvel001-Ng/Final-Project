const registerForm = document.querySelector("#register-form");
const registerMessage = document.querySelector("#register-message");

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // userinput
    const fullName = document.querySelector("#full-name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const userData = {
        username: fullName,
        email: email,
        password: password
    };

    fetch("https://final-project-n7u6.onrender.com/Tour-Edo/auth/signup", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
})
.then(response => response.json())
.then(data => {
    if (data.registedUser) {
        registerMessage.textContent = data.msg;
        registerMessage.classList.add("success");
    } else {
        registerMessage.textContent = data.msg;
        registerMessage.classList.add("error");
    }
});


});