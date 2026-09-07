// const forgotForm = document.querySelector("#forgot-form");
// const forgotMessage = document.querySelector("#forgot-message");

// forgotForm.addEventListener("submit", async function (event) {

//     event.preventDefault();

//     const email = document.querySelector("#email").value;

//     const forgotData = {
//     email: email
// };

// const response = await fetch("https://final-project-n7u6.onrender.com/Tour-Edo/auth/forgot-password", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(forgotData)
//     });

//     const data = await response.json();

//     forgotMessage.textContent = data.msg;
// });

const forgotForm = document.querySelector("#forgot-form");
const forgotMessage = document.querySelector("#forgot-message");

forgotForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.querySelector("#email").value;

    const forgotData = {
        email: email
    };

    try {

        const response = await fetch("https://final-project-n7u6.onrender.com/Tour-Edo/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(forgotData)
        });

        console.log("Request reached the API");
        console.log(response);

        const data = await response.json();

        forgotMessage.textContent = data.msg;

    } catch (error) {

        console.log(error);
        forgotMessage.textContent = "Something went wrong. Please try again.";

    }

});