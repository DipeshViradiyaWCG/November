let currentPage = 1;
$(document).ready(function () {

    /**
     * 
     * @param {Active page number when requested on ajax} currentPage 
     * @param {feild name to sort} feild optional
     * @param {sorting flag} flag optional
     * 
     * function to display users data in paginated manner
     */

    function displayUsers(currentPage, feild, flag, searchText, searchGender){
        // console.log(typeof searchText,"     ", searchText.length);
        if(searchText.length == 0)
            searchText = "undefined";
        $.ajax({
            url: "/displayUsers/" + currentPage + "/" + feild + "/" + flag + "/" + searchText + "/" + searchGender,
            type: "get",
            success: function (res) {
                $('.display-users').html(res);
                $("a[data-page='"+currentPage+"']").addClass("activeBorder");
                if(flag){
                    if(flag > 0){
                        $("a.sort").attr("title", "Sort in Descending order")    
                    } else {
                        $("a.sort").attr("title", "Sort in Ascending order")   
                    }
                    $("a.sort").data("flag", Number(flag)*-1);
                }
            }
        }); 
    }
    displayUsers(currentPage, undefined, undefined, $("#searchText").val(), $("#genderSelect").val());

    // Validate form
    $("#form").validate({
        rules: {
            firstName: "required",
            lastName : "required",
            address: {
                required : true,
                minlength : 10
            },
            state: "required",
            gender: "required",
            hobby: "required"
        },
        messages: {
            firstName: "Please specify your first name",
            lastName : "Please specify your last name",
            address:{
                required : "We need your address to contact you",
                minlength : "Address should be 10 chars long"
            },
            state : "Please select the state",
            gender: "Please select gender",
            hobby: "Please select one hobby"
        },

        // Set css class to errors
        errorClass : "text-danger",
        errorPlacement: function(error, element) {
                error.appendTo(element.parent());
        },

        // Submit form when validated
        submitHandler: function(form) {
            let hobbies = [];
            $('input[type=checkbox]').each(function () {
                if(this.checked)
                    hobbies.push($(this).val());
            });

            let fd =  new FormData();
            fd.append("firstName", $("#firstName").val());
            fd.append("lastName", $("#lastName").val());
            fd.append("address", $("#address").val());
            fd.append("state", $("#state").val());
            fd.append("gender", $("input[type=radio]:checked").val());
            fd.append("hobby", JSON.stringify(hobbies));
            
            // Append file data if exist
            if($("#profile")[0].files[0]){
                if(!["image/jpg","image/jpeg","image/png"].includes($("#profile")[0].files[0].type)){
                    $("#errorMessage").html("Uploaded file is not image");
                    return;
                }
                fd.append("profile", $("#profile")[0].files[0]);
            }

            // Ajax req to add data in DB
            $.ajax({
                url: '/',
                type: "post",
                contentType: false,
                processData: false,
                data: fd,
                success: function (res) {
                    if (res.status == "success") {
                        $("#form")[0].reset();
                        cleanForm();
                        displayUsers(currentPage, undefined, undefined, $("#searchText").val(), $("#genderSelect").val());
                    } else {
                        $("#errorMessage").html(res.error);
                    }
                }
            }); 

            return false;
        }
    });
    
    // Remove record from DB and table for delete-btn
    $(document).off("click", ".delete-btn")
        .on("click", ".delete-btn", function(){
            let deleteBtnId = $(this).data("id");
            $.ajax({
                url: "/" + deleteBtnId + "",
                type: "delete",
                success: function (res) {
                    if (res.status == "success") {
                        displayUsers(currentPage, undefined, undefined, $("#searchText").val(), $("#genderSelect").val());
                    } else {
                        $("#errorMessage").html(res.error);
                    }
                }
            }); 
        });

    // Render user data in form for editing
    $(document).off("click", ".edit-btn")
        .on("click", ".edit-btn", function(){
            let editBtnId = $(this).data("id");
            $.ajax({
                url: "/" + editBtnId + "",
                type: "get",
                success: function (res) {
                    if (res.status == "success") {
                        $("label.text-danger").remove();
                        $("input, textarea, select").removeClass("text-danger");
                        $("#firstName").val(res.user.name.split(" ")[0]);
                        $("#lastName").val(res.user.name.split(" ")[1]);
                        $("#address").val(res.user.address);
                        $("#" + res.user.gender).attr("checked", true);
                        $("#state").val(res.user.state);
                        $("#profile").parent().prepend("<img src='/images/" + res.user.profile + "' height='70'></img>");
                        for(let hobbyElement of res.user.hobby){
                            $("#" + hobbyElement).attr("checked", "checked");
                        }
                        $("#btnsubmit").html("Update user").attr("id", "btnupdate").attr("type", "button").data("id",res.user._id);
                        $("#btns").append("<button type='submit' class='btn btn-primary' id='btncancel'>Cancel</button>");
                        $(".edit-btn").attr('disabled',true);
                        $(".delete-btn").attr('disabled',true);
                        $(".paginationDiv").css("pointer-events", "none");
                        $(".searchDiv").css("pointer-events", "none");
                    } else {
                        $("#errorMessage").html(res.error);
                    }
                }
            }); 
        });

    // Update user data in DB and table
    $(document).off("click", "#btnupdate")
        .on("click", "#btnupdate", function(){
            if($("#form").valid()){
                let updateBtnId = $(this).data("id");
                let hobbies = [];
                $('input[type=checkbox]').each(function () {
                    if(this.checked)
                        hobbies.push($(this).val());
                });
        
                let fd =  new FormData();
                fd.append("firstName", $("#firstName").val());
                fd.append("lastName", $("#lastName").val());
                fd.append("address", $("#address").val());
                fd.append("state", $("#state").val());
                fd.append("gender", $("input[type=radio]:checked").val());
                fd.append("hobby", JSON.stringify(hobbies));
                if($("#profile")[0].files[0]){
                    fd.append("profile", $("#profile")[0].files[0]);
                }
        
                $.ajax({
                    url: '/' + updateBtnId + "",
                    type: "put",
                    contentType: false,
                    processData: false,
                    data: fd,
                    success: function (res) {
                        if (res.status == "success") {
                            displayUsers(currentPage, undefined, undefined, $("#searchText").val(), $("#genderSelect").val());
                            $("#btncancel").remove();
                            $("#btnupdate").html("Add user").attr("id", "btnsubmit").attr("type", "submit");
                            $("#form")[0].reset();
                            cleanForm();
                            $(".edit-btn").attr('disabled',false);
                            $(".delete-btn").attr('disabled',false);
                            $(".paginationDiv").css("pointer-events", "all");
                            $(".searchDiv").css("pointer-events", "all");
                        } else {
                            $("#errorMessage").html(res.error);
                        }
                    }
                }); 
            } else {
                $("#errorMessage").html("Invalid data is not allowed...");
            }
        });

    // Revert the editing when canceled
    $(document).off("click", "#btncancel")
        .on("click", "#btncancel", function(){
            $("label.text-danger").remove();
            $("input, textarea, select").removeClass("text-danger");
            $("#btncancel").remove();
            $("#btnupdate").html("Add user").attr("id", "btnsubmit").attr("type", "submit");
            $("#form")[0].reset();
            cleanForm();
            $(".edit-btn").attr('disabled',false);
            $(".delete-btn").attr('disabled',false);
            $(".paginationDiv").css("pointer-events", "all");
            $(".searchDiv").css("pointer-events", "all");
        });

    // diaplay users in sorted manner according to feild name and flag
    $(document).off("click", "a.sort").on("click", "a.sort", function(){
        let flag = $(this).data("flag");
        displayUsers(1, $(this).data("feild"), flag, $("#searchText").val(), $("#genderSelect").val());
        if(flag > 0){
            $(this).attr("title", "Sort in Descending order")    
        } else {
            $(this).attr("title", "Sort in Ascending order")   
        }
        $(this).data("flag", Number(flag)*-1);
    });

    // Update global currentPage when clicked accordingly
    $(document).off("click", "a.page-link").on("click", "a.page-link", function(){
        currentPage = Number($(this).data("page"));
        displayUsers(currentPage, undefined, undefined, $("#searchText").val(), $("#genderSelect").val());
    });

    // Clicked on previous - Decrease current page by 1
    $(document).off("click", "a.prevPage").on("click", "a.prevPage", function(){
        currentPage = Number($(".activeBorder").data("page")) - 1;
        displayUsers(currentPage, undefined, undefined, $("#searchText").val(), $("#genderSelect").val());
    });
    
    // Clicked on next - Increase current page by 1
    $(document).off("click", "a.nextPage").on("click", "a.nextPage", function(){
        currentPage = Number($(".activeBorder").data("page")) + 1;
        displayUsers(currentPage, undefined, undefined, $("#searchText").val(), $("#genderSelect").val());
    });

    $("#searchBtn").on("click", function(){
        displayUsers(currentPage, undefined, undefined, $("#searchText").val(), $("#genderSelect").val());
    });

});

// A function to remove/empty radios, checkboxes and image 
function cleanForm(){
    $("input[name='gender']").attr("checked", false);
    $("input[name='hobby']").attr("checked", false);
    $("img[height='70']").remove();
    $("#errorMessage").html("");
}