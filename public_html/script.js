$(document).on("click", '[data-toggle="lightbox"]', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
});

$(document).ready(function(){
    document.getElementById("contact-form")
    /* begin validate function here */
    $("#contact-form").validate({

        // setup handling of form errors
        debug: true,
        errorClass: "alert alert-danger",
        errorLabelContainer: "#output-area",
        errorElement: "div",

        // rules here define what is good or bad input
        // each rule starts with the form input element's NAME attribute
        rules: {
            name: {
                required: true
            },
            email: {
                email: true,
                required: true
            },
            message: {
                required: true,
                maxlength: 2000
            }
        },

        // error messages to display to the end user when rules above don't pass
        messages: {
            name: {
                required: "Please enter a name."
            },
            email: {
                email: "Please enter a valid email address.",
                required: "Please enter a valid email address."
            },
            message: {
                required: "Please enter a message.",
                maxlength: "2000 characters max."
            }
        },

        // AJAX submit the form data to back end if rules pass
        submitHandler: (form) => {
            $("#contact-form").ajaxSubmit({
                type: "POST",
                url: $("#contact-form").attr("action"),

                success: (ajaxOutput) => {
                    // clear the output area's formatting
                    $("#output-area").css("display", "")

                    // write the server's reply to the output area
                    $("#output-area").html(ajaxOutput)

                    // reset the form if it was successful
                    if($(".alert-success" >= 1)) {
                        $("#contact-form")[0].reset()
                    }
                }
            })
        }

    })/* end validate function here */

})/*end document.ready()*/