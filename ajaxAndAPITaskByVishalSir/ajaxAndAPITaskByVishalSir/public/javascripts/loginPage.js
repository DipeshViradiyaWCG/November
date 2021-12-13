$(document).ready(function () {
    $("#loginForm").validate({
        rules : {
            emailOrContact : "required",
            password : "required"
        },
        messages : {
            emailOrContact : "Please use your email or contact number to authenticate...",
            password : "Please specify your password..."
        },

        // Set css class to errors
        errorClass : "text-danger",
        errorPlacement: function(error, element) {
                error.appendTo(element.parent());
        },

        submitHandler: function (form) {
            $.ajax({
                url : '/api/login',
                type : 'post',
                data : {
                    emailOrContact : $("#emailOrContact").val(),
                    password : $("#password").val()
                },
                dataType : 'json',
                success : function (res) {
                    console.log(res);
                    if (res.code == 200){
                        $(document)[0].cookie = `authToken=${res.token}`;
                        $(location).attr('href', '/users');
                    } else {
                        $("#errorMessage").html(res.message);
                    }
                }
            });
        }
    });
});