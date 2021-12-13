$(document).ready(function () {
    
    function showUsers(){
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
    }

    showUsers();

});