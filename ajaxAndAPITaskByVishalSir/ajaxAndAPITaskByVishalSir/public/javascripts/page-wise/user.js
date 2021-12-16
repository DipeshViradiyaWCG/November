const userEventHandler = function (){

    this.init = function(){
        _this.showUsers();
        _this.showFiles();
        _this.addUser();
        _this.logoutUser();
        _this.exportUser();
        _this.importFile();
        _this.mapFile();
        _this.cancelMapFile();
        _this.cancelMapChoices();
        _this.confirmMapChoices();
        _this.cancelMessage();
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
                    $("#showUsersDiv").html(res);
                } else {
                    $("#errorMessage").html(res.message);
                }
            }
        });
    };

    this.showFiles = function () {
        $.ajax({
            url : '/api/showFiles',
            type : 'get',
            headers: {
                'authToken': document.cookie.split("=")[1]
            },
            success : function (res) {
                console.log(res);
                if(res.code != 404){
                    $("#showFilesDiv").html(res);
                } else {
                    $("#errorMessage").html(res.message);
                }
            }
        });
    }

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
                            _this.showUsers();
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

    this.importFile = function () {
        $("#importBtn").click(function () {

            let fd =  new FormData();

            // Append file data if exist
            if($("#importFile")[0].files[0]){
                if($("#importFile")[0].files[0].type != "text/csv"){
                    $("p#errorMessageFile").html("Uploaded file is not csv file");
                    return;
                }
                fd.append("importFile", $("#importFile")[0].files[0]);
            } else {
                $("p#errorMessageFile").html("Please upload a file first...");
                return;
            }

            $.ajax({
                url : '/api/importFile',
                type : 'post',
                headers: {
                    'authToken': document.cookie.split("=")[1]
                },
                contentType: false,
                processData: false,
                data: fd,
                success: function (res) {
                    $("p#errorMessageFile").html("");
                    if (!res.code) {
                        $("#mapFileDiv").html(res);
                        $("div.showUserDiv").css("pointer-events","none");
                        $(document).scrollTop($(document).height());
                        // $("#importForm")[0].reset();
                    } else {
                        $("p#errorMessageFile").html(res.message);
                    }
                }
            });
        });
    }

    this.mapFile = function () {
        $(document).off('click', "#mapBtn").on('click', "#mapBtn", function () {
            
            let multiplefeildSelectFlag = false;
            for( let i = 0; i < $("#mapTable > tbody > tr").length; i++ ){
                if($("select."+i).val().length != 0){
                    if(mapHeaderObj[$("select."+i).val().slice(0,-1)]){
                        multiplefeildSelectFlag = true;
                    }
                    mapHeaderObj[$("select."+i).val().slice(0,-1)] = $("select."+i).attr('id').slice(0,-1);
                }
            }
            if((mapHeaderObj["email"]) || (mapHeaderObj["contact"])){
                if(multiplefeildSelectFlag){
                    $("#warningMessage").html(`Thanks for uploading file.<br>Selecting same data feild multiple times will consider the last one.We recommend you to reconsider your choices.<br>Other wise mapping will follow the following pattern.<br>`);
                    let htmlStr = `    <table class="table">
                    <thead>
                        <tr>
                            <th>Data Feild</th>
                            <th>CSV header in consideration</th>
                        </tr>
                    </thead>
                    <tbody>
                        `;
                        for(let key of Object.keys(mapHeaderObj)){
                            htmlStr += `<tr><td>` + key + `</td><td>` + mapHeaderObj[key] + `</td></tr>`;
                        }
                        htmlStr += `            </tr>
                                            </tbody>
                                        </table>
                                        <a id="okBtn" class="btn btn-primary" >Ok</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id="cancelBtn" class="btn btn-secondary">Cancel</a>`;
                    $("#mapObjTable").html("");
                    $("#mapObjTable").html(htmlStr);
                    $(document).scrollTop($(document).height());
                } else {
                    $("#mapObjTable").html("");
                    $("#warningMessage").html("Thank you for uploading a file.Your request will be processed soon...");
                    _this.uploadUsersToDB();
                    $("div.showUserDiv").css("pointer-events","all");
                }
            } else {
                $("#warningMessage").html("You must map csv header with either email or contact no.");
            }
        });
    }

    this.cancelMapFile = function () {
        $(document).off('click', "#mapCancelBtn").on('click', "#mapCancelBtn", function () {
            $("#mapFileDiv").html("");
            $("div.showUserDiv").css("pointer-events","all");
            $("#importForm")[0].reset();
        });
    }

    this.cancelMapChoices = function () {
        $(document).off('click', "#cancelBtn").on('click', "#cancelBtn", function () {
            $("#mapObjTable").html("");
            $("#warningMessage").html("");
            $("div.showUserDiv").css("pointer-events","all");
        });
    }

    this.confirmMapChoices = function () {
        $(document).off('click', "#okBtn").on('click', "#okBtn", function () {
            $("#mapObjTable").html("");
            $("#warningMessage").html("Thank you for uploading a file.Your request will be processed soon...");
            _this.uploadUsersToDB();
            $("div#mapFileDiv").html("");
            $("div.showUserDiv").css("pointer-events","all");
        });
    }

    this.uploadUsersToDB = function () {
        $.ajax({
            url : '/api/uploadUsersToDB?fileUploaded=' + $("p.fileUploaded").attr('id') + "&fileId=" + $("p.fileId").attr('id'),
            type : 'post',
            headers: {
                'authToken': document.cookie.split("=")[1]
            },
            data : mapHeaderObj,
            dataType : 'json',
            success : function (res) {
                if(res.code == 200){
                    $("#mapObjTable").html("");
                    $("#warningMessage").html("");
                    $("#successMessageFile").html(`<button class="btn btn-secondary" id="messageClose"><h6>X<h6></button>` + res.message);
                    _this.showUsers();
                    $("#importForm")[0].reset();
                }
            }
        });
    }

    this.cancelMessage = function () {
        $(document).off('click', "#messageClose").on('click', "#messageClose", function () {
            $("#warningMessage").html("");
            $("#errorMessageFile").html("");
            $("#successMessageFile").html("");
        });
    }

    let _this = this;
    let mapHeaderObj = {};
    this.init();    
}