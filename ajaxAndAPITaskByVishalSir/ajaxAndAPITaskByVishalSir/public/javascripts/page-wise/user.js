const userEventHandler = function (){

    this.init = function(){
        _this.showUsers();
        _this.addUser();
        _this.logoutUser();
        _this.exportUser();
    };

    this.showUsers = function(){
        $.ajax({
            url : '/api/showUsers',
            type : 'get',
            headers: {
                'authToken': document.cookie.split("=")[1]
            },
            success : function (res) {
                if(res.code != 404){
                    console.log(res);
                    $("#showUsersDiv").html(res);
                } else {
                    $("#errorMessage").html(res.message);
                }
            }
        });
    };

    this.addUser = function () {
        $("#addUserForm").validate({
            rules : {
                name : "required",
                email : "required",
                contact : "required",
                password : {
                    required : true,
                    minlength : 6
                }
            },
            messages : {
                name : "Please specify your name...",
                email : "Please specify your email...",
                contact : "Please specify your contact number...",
                password : {
                    required : "Please specify your password...",
                    minlength : "The password should be minimum 6 characters long..."
                }
            },
    
            // Set css class to errors
            errorClass : "text-danger",
            errorPlacement: function(error, element) {
                    error.appendTo(element.parent());
            },
    
            submitHandler: function (form) {
                $.ajax({
                    url : '/api/addUser',
                    type : 'post',
                    headers: {
                        'authToken': document.cookie.split("=")[1]
                    },
                    data : {
                        name : $("#name").val(),
                        email : $("#email").val(),
                        contact : $("#contact").val(),
                        password : $("#password").val()
                    },
                    dataType : 'json',
                    success : function (res) {
                        console.log(res);
                        if (res.code == 200){
                            showUsers();
                        } else {
                            if(res.errs){
                                $("#errorMessage").html(res.errs.email[0]);    
                            } else {
                                $("#errorMessage").html(res);
                            }
                        }
                    }
                });
            }
        });
    }

    this.logoutUser = function () {
        $(document).off('click', 'a#logoutBtn').on('click', 'a#logoutBtn', function(){
            $.ajax({
                url : '/api/logout',
                type : 'get',
                success : function(res) {
                    if(res.code == 200){
                        $(location).attr('href', '/');
                    } else {
                        $("#errorMessage").html(res);
                    }
                }
            });
        });
    }

    this.exportUser = function () {
        $(document).off('click', 'a#exportBtn').on('click', 'a#exportBtn', function(){
            console.log("clicked");
            $.ajax({
                url : '/api/showUsers?exportFlag=true',
                type : 'get',
                headers: {
                    'authToken': document.cookie.split("=")[1]
                },
                success : function (res) {
                    if(res.code != 404){
                        $("body").append("<a href='"+ res.downloadUrl +"' id='downloadLink'></a>");
                        $("#downloadLink")[0].click();
                        $("#downloadLink").remove();
                    } else {
                        $("#errorMessage").html(res.message);
                    }
                }
            });
        });
    }

    let _this = this;
    this.init();    
}