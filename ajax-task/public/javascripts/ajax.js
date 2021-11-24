let currentPage = 1;
$(document).ready(function () {

    /**
     * A Function to convert query string to object - client side
     */
    var re = /([^&=]+)=?([^&]*)/g;
    var decodeRE = /\+/g;  // Regex for replacing addition symbol with a space
    var decode = function (str) {return decodeURIComponent( str.replace(decodeRE, " ") );};
    $.parseParams = function(query) {
        var params = {}, e;
        while ( e = re.exec(query) ) { 
            var k = decode( e[1] ), v = decode( e[2] );
            if (k.substring(k.length - 2) === '[]') {
                k = k.substring(0, k.length - 2);
                (params[k] || (params[k] = [])).push(v);
            }
            else params[k] = v;
        }
        return params;
    };

    /**
     * 
     * @param {current active page} currentPage 
     * @param {sorting feild and flag query string} sortingQuery 
     * @param {text to search in users data} searchText 
     * @param {search gender} searchGender 
     * @param {file export options - exportFlag, exportEmailFlag, exportEmail} exportOps 
     * @param {boolean to whether redirect the current active page to first page or not} redirectFlag 
     */

    function displayUsers(currentPage, sortingQuery, searchText, searchGender, exportOps, redirectFlag){

        let queryURL = "/displayUsers?currentPage=" + currentPage;
        if(sortingQuery != undefined && sortingQuery.length > 0)
            queryURL += "&" + sortingQuery;

        if(searchText.length != 0)
            queryURL += "&searchText=" + searchText;
            
        if(searchGender != undefined)
            queryURL += "&searchGender=" + searchGender;
        
        if(exportOps){
            if(exportOps.exportFlag)
                queryURL += "&exportFlag=" + exportOps.exportFlag;
            if(exportOps.exportEmailFlag)
                queryURL += "&exportEmailFlag=" + exportOps.exportEmailFlag + "&exportEmail=" + exportOps.exportEmail;
        }

        if(redirectFlag)
            queryURL += "&redirectFlag=" + redirectFlag.redirectFlag;
        
        $.ajax({
            url: queryURL,
            type: "get",
            success: function (res) {
                if(exportOps && exportOps.exportFlag){
                    if(exportOps.exportEmailFlag){
                        $("#emailMessage").html("Your request for csv file link has been registered succesfully...");
                    } else {
                        $("body").append("<a href='"+ res.downloadUrl +"' id='downloadLink'></a>");
                        $("#downloadLink")[0].click();
                        $("#downloadLink").remove();
                    }
                }else{
                    $('.display-users').html(res);
                    $("a[data-page='"+res.currentPage+"']").addClass("activeBorder");
                    if($.parseParams(sortingQuery).flag > 0){
                        $("a.sort[data-feild='"+ $.parseParams(sortingQuery).feild +"']").attr("title", "Sort in Descending order");
                    } else {
                        $("a.sort[data-feild='"+ $.parseParams(sortingQuery).feild +"']").attr("title", "Sort in Ascending order"); 
                    }
                    $("a.sort[data-feild='"+ $.parseParams(sortingQuery).feild +"']").data("flag", Number($.parseParams(sortingQuery).flag)*-1);
                    $("#emailMessage").html("");
                }
            }
        }); 
    }
    displayUsers(currentPage, "", $("#searchText").val(), $("#genderSelect").val());

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
                        let qs = $("a.prevPage").data("qs");
                        displayUsers(currentPage, qs, $("#searchText").val(), $("#genderSelect").val());
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
            $.confirm({
                title: 'Confirm!',
                content: 'Simple confirm!',
                buttons: {
                    confirm: function () {
                        $.ajax({
                            url: "/" + deleteBtnId + "",
                            type: "delete",
                            success: function (res) {
                                if (res.status == "success") {
                                    let qs = $("a.prevPage").data("qs");
                                    displayUsers(currentPage, qs, $("#searchText").val(), $("#genderSelect").val());
                                } else {
                                    $("#errorMessage").html(res.error);
                                }
                            }
                        }); 
                    },
                    cancel: function () {
                        return;
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
                            let qs = $("a.prevPage").data("qs");
                            displayUsers(currentPage, qs, $("#searchText").val(), $("#genderSelect").val());
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

    // display users in sorted manner according to feild name and flag
    $(document).off("click", "a.sort").on("click", "a.sort", function(){
        let flag = $(this).data("flag");
        let qs = "feild=" + $(this).data("feild") + "&flag=" + $(this).data("flag");
        displayUsers(1, qs, $("#searchText").val(), $("#genderSelect").val());
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
        let qs= $(this).data('qs');
        displayUsers(currentPage, qs, $("#searchText").val(), $("#genderSelect").val());
    });

    // Clicked on previous - Decrease current page by 1
    $(document).off("click", "a.prevPage").on("click", "a.prevPage", function(){
        currentPage = Number($(".activeBorder").data("page")) - 1;
        let qs= $(this).data('qs');
        displayUsers(currentPage, qs, $("#searchText").val(), $("#genderSelect").val());
    });
    
    // Clicked on next - Increase current page by 1
    $(document).off("click", "a.nextPage").on("click", "a.nextPage", function(){
        currentPage = Number($(".activeBorder").data("page")) + 1;
        let qs= $(this).data('qs');
        displayUsers(currentPage, qs, $("#searchText").val(), $("#genderSelect").val());
    });

    // Clicked on search button - request to search data through ajax
    $("#searchBtn").on("click", function(){
        currentPage = Number($(".activeBorder").data("page"));
        let qs = $("a.prevPage").data("qs");
        displayUsers(currentPage, qs, $("#searchText").val(), $("#genderSelect").val(), {}, {redirectToFirstPage : true});
    });

    // Export csv file of data and download
    $(document).off("click", "#exportBtn").on("click", "#exportBtn", function(){
        currentPage = Number($(".activeBorder").data("page"));
        let qs = $("a.prevPage").data("qs");
        displayUsers(currentPage, qs, $("#searchText").val(), $("#genderSelect").val(), {exportFlag : true});
    });

    // Request a link for csv file download on email
    $(document).off("click", "#exportEmailBtn").on("click", "#exportEmailBtn", function(){
        currentPage = Number($(".activeBorder").data("page"));
        let qs = $("a.prevPage").data("qs");
        let reqEmail = prompt("Enter your email");
    
        let emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if(reqEmail.length > 0 && emailReg.test(reqEmail)){
            displayUsers(currentPage, qs, $("#searchText").val(), $("#genderSelect").val(), {exportFlag : true, exportEmailFlag : true, exportEmail : reqEmail});
        }else {
            $("#errorMessage").html("Invalid email 6");        
        }
    });

});

// A function to remove/empty radios, checkboxes and image 
function cleanForm(){
    $("input[name='gender']").attr("checked", false);
    $("input[name='hobby']").attr("checked", false);
    $("img[height='70']").remove();
    $("#errorMessage").html("");
}