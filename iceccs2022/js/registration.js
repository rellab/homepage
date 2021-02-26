const reg_form = document.getElementById('reg_form')
const early_options = Array.from(document.getElementsByClassName('e-option'))
const normal_options = Array.from(document.getElementsByClassName('n-option'))
const payment_select = document.getElementById('payment-select')
const submit_button = document.getElementById('submit-button')

const cutoff_date = new Date('2018-11-05T00:00:00')
const current_date = new Date().getTime()

if (cutoff_date >= current_date) {
    normal_options.forEach((el) => el.style.display = 'none')
    payment_select.value = early_options[0].value
} else {
    early_options.forEach((el) => el.style.display = 'none')
    payment_select.value = normal_options[0].value
}

reg_form.addEventListener("submit", function (event) {
    event.preventDefault()
    submit_button.disabled = true
    const form_data = {
        'first_name': reg_form.first_name.value,
        'last_name': reg_form.last_name.value,
        'email': reg_form.email.value,
        'contact': reg_form.contact.value,
        'affiliation': reg_form.affiliation.value,
        'address': reg_form.address.value,
        'paper': reg_form.paper.value ? reg_form.paper.value : 'N.A'
    }

    axios.post('https://lmbu91trif.execute-api.ap-southeast-1.amazonaws.com/alpha', form_data)
        .then(function (response) {
            console.log(response)
            if (response.status === 200) {
                alert("Your form is submitted successfully. \n\n" +
                    "Please proceed to payment to complete the registration process.")
                reg_form.reset()
            }
            submit_button.disabled = false
        })
        .catch(function (error) {
            console.error(error)
            alert("Cannot connect to registration server. \n\n" +
                "Please try again later or send your details to our organizer via email.")
            submit_button.disabled = false
        })
})