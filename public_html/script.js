$(document).on("click", '[data-toggle="lightbox"]', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
});

$(document).ready(function(){

    /**
     * jQuery Validate Function
     *
     * This function provides front-end validation for your form.
     * If all tests set up here pass, the form data is AJAX submitted
     * to the mailer.php file.
     *
     * Update this file as needed for your form.
     * All ids and name values must match up to your form here.
     *
     * @author Rochelle Lewis <rlewis37@cnm.edu>
     **/

    /* begin validate function here */
    $("#demo-form").validate({

        // setup handling of form errors
        debug: true,
        errorClass: "alert alert-danger",
        errorLabelContainer: "#output-area",
        errorElement: "div",

        // rules here define what is good or bad input
        // each rule starts with the form input element's NAME attribute
        rules: {
            demoName: {
                required: true
            },
            demoEmail: {
                email: true,
                required: true
            },
            demoMessage: {
                required: true,
                maxlength: 2000
            }
        },

        // error messages to display to the end user when rules above don't pass
        messages: {
            demoName: {
                required: "Y U have no name?"
            },
            demoEmail: {
                email: "Please enter a valid email address.",
                required: "Please enter a valid email address."
            },
            demoMessage: {
                required: "Please enter a message.",
                maxlength: "2000 characters max."
            }
        },

        // AJAX submit the form data to back end if rules pass
        submitHandler: function(form) {
            $("#demo-form").ajaxSubmit({
                type: "POST",
                url: $("#demo-form").attr("action"),

                success: function(ajaxOutput) {
                    // clear the output area's formatting
                    $("#output-area").css("display", "");

                    // write the server's reply to the output area
                    $("#output-area").html(ajaxOutput);

                    // reset the form if it was successful
                    if($(".alert-success").length >= 1) {
                        $("#demo-form")[0].reset();
                    }
                }
            })
        }

    });/* end validate function here */

});/*end document.ready()*/