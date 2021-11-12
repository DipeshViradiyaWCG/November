$(document).ready(function () {

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
            
            // Append file data if exists
            console.log($("#profile")[0].files[0].type);
            // return;
            if(!["image/jpg","image/jpeg","image/png"].includes($("#profile")[0].files[0].type)){
                $("#errorMessage").html("Uploaded file is not image");
                return;
            }
            if($("#profile")[0].files[0]){
                fd.append("profile", $("#profile")[0].files[0]);
            }

            console.log(fd);

            // Ajax req to add data in DB
            $.ajax({
                url: '/',
                type: "post",
                contentType: false,
                processData: false,
                data: fd,
                success: function (res) {
                    if (res.status == "success") {
                        $("#table").append("<tr class='"+ res.user._id +"'> <td><img src='/images/" + res.user.profile + "' height='150'></td> <td> " + res.user.name + "</td> <td> " + res.user.gender + "</td> <td> " + res.user.address + "</td> <td><button class='btn-primary edit-btn' data-id='"+ res.user._id+"'>Edit</button> </td> <td><button class='btn-danger delete-btn' data-id='"+res.user._id+"'>Delete</button></td> </tr>");
                        $("#form")[0].reset();
                        $("#errorMessage").html("");
                    } else {
                        $("#errorMessage").html(res.error);
                    }
                }
            }); 
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
                        $("."+deleteBtnId).remove();
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
                            let rowId = updateBtnId;
                            $("." + rowId).html("");
                            $("." + rowId).html("<td><img src='/images/" + res.user.profile + "' height='150'></td> <td> " + res.user.name + "</td> <td> " + res.user.gender + "</td> <td> " + res.user.address + "</td> <td> <button class='btn-primary edit-btn' data-id='"+ res.user._id + "'>Edit</button> </td><td> <button class='btn-danger delete-btn' data-id='"+ res.user._id + "'>Delete</button> </td>");
                            $("#btncancel").remove();
                            $("#btnupdate").html("Add user").attr("id", "btnsubmit").attr("type", "submit");
                            $("#form")[0].reset();
                            cleanForm();
                            $(".edit-btn").attr('disabled',false);
                            $(".delete-btn").attr('disabled',false);
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
        });
    });

// A function to remove/empty radios, checkboxes and image 
function cleanForm(){
    $("input[name='gender']").attr("checked", false);
    $("input[name='hobby']").attr("checked", false);
    $("img[height='70']").remove();
    $("#errorMessage").html("");
}