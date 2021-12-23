const userEventHandler = function (){

    this.init = function(){
        // this.socket = io.connect('http://localhost:4000', { transports : ['websocket']});
        this.showUsers();
        this.showFiles();
        this.addUser();
        this.logoutUser();
        this.exportUser();
        this.importFile();
        this.mapFile();
        this.cancelMapFile();
        this.cancelMapChoices();
        this.confirmMapChoices();
        this.cancelMessage();
        this.socketEventListeners();
    };

    // send request to get users data
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

    // send request to get file data
    this.showFiles = function () {
        $.ajax({
            url : '/api/showFiles',
            type : 'get',
            headers: {
                'authToken': document.cookie.split("=")[1]
            },
            success : function (res) {
                if(res.code != 404){
                    $("#showFilesDiv").html(res);
                    for(let ele of $("td")){
                        if($(ele).html() == "pending"){
                           $(ele).attr("class", "text-danger");
                        } else if($(ele).html() == "in progress") {
                            $(ele).attr("class", "text-info");
                        } else if ($(ele).html() == "uploaded") {
                            $(ele).attr("class", "text-success");
                        }
                    }
                } else {
                    $("#errorMessage").html(res.message);
                }
            }
        });
    }

    // send request to add validated user data.
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

    // send request to logout user
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

    // send request to export csv file of user data. 
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

    // send request to upload validated csv file and generate GUI for mapping.
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
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    console.log("myXhr ===============> ");
                    console.log(myXhr);

                    $("input#importFile").parent().append("<div class=\"file-upload-status\"><input type=\"range\" id=\"importFileRange\" min=\"0\" max=\"100\" value=\"\" step=\"50\" /> <span id=\"spanImportFileRange\"></span> % </div><br>");
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress', function (event) {
                                var percent = 0;
                                var position = event.loaded || event.position;
                                var total = event.total;
                                if (event.lengthComputable) {
                                    percent = Math.ceil(position / total * 100);
                                }
                                $("#spanImportFileRange").html(percent);
                                $("input#importFileRange").attr("value", percent.toString());
                        }, false);
                    }
                    return myXhr;
                },
                success: function (res) {
                    $("p#errorMessageFile").html("");
                    if (!res.code) {
                        $("div.file-upload-status").remove();
                        $("#mapFileDiv").html(res);
                        $("div.showUserDiv").css("pointer-events","none");
                        $(document).scrollTop($(document).height());
                        mapHeaderObj = {};

                        // Do not allow user to select multiple choice for same data feild
                        let totalDropDown = $("select").length;
                        let demo = {};
                        for(let i = 0; i < totalDropDown; i++){
                            demo[i] = "";
                        }
                        for(let i = 0; i < totalDropDown; i++){
                            $("select."+i).change(function(){

                                if($("select."+i).val() == "addDataFeild") {

                                    $.confirm({
                                        title: 'Add a new data feild',
                                        content: '' +
                                        '<form action="" class="formName">' +
                                        '<div class="form-group">' +
                                        '<label>Enter Data feild name <span class="text-danger">*</span> : </label>' +
                                        '<input type="text" class="name form-control" required />' +
                                        '</div>' +
                                        '</form>',
                                        buttons: {
                                            formSubmit: {
                                                text: 'Submit',
                                                btnClass: 'btn-blue',
                                                action: function () {
                                                    var addDataFeildValue = this.$content.find('.name').val();
                                                    if(!addDataFeildValue){
                                                        $.alert('provide a valid data feild name');
                                                        return false;
                                                    }
                                                    _this.addNewDataFeild(addDataFeildValue, i);
                                                }
                                            },
                                            cancel: function () {
                                                //close
                                            },
                                        }
                                    });

                                }

                                let valueEnable = demo[$("select."+i).attr('class')];
                                demo[$("select."+i).attr('class')] = $("select."+i).val();
                                let valueDisable = $("select."+i).val();
                                for(let j = 0; j < totalDropDown; j++){
                                    if(valueDisable != "" && valueDisable != "addDataFeild" && j != i){
                                        $("select."+j).children("option[value='"+ valueDisable +"']").prop('disabled', true);
                                    }
                                    $("select."+j).children("option[value='"+ valueEnable +"']").prop('disabled', false);
                                }
                            });
                        }
                    } else {
                        $("p#errorMessageFile").html(res.message);
                    }
                }
            });
        });
    }

    // Allow user to add dynamic feilds in mapping process.
    this.addNewDataFeild = function (addDataFeildValue, selectTagIterator) {
        $.ajax({
            url : '/api/addNewDataFeild',
            type : 'post',
            headers: {
                'authToken': document.cookie.split("=")[1]
            },
            data : {
                key : addDataFeildValue
            },
            dataType : 'json',
            success : function (res) {
                if(res.code == 200) {
                    let totalDropDown = $("select").length;
                    for(let i = 0; i < totalDropDown; i++){
                        if(i == selectTagIterator){
                            $("select." + i + " option[value='addDataFeild']").before(`<option value="${addDataFeildValue}" selected>${addDataFeildValue}</option>`);
                        } else {
                            $("select." + i + " option[value='addDataFeild']").before(`<option value="${addDataFeildValue}" disabled>${addDataFeildValue}</option>`);
                        }
                    }
                } else {
                    $("p#errorMessageFile").html(res.message);
                }
            }
        });
    }

    // Map csv headers with db feilds according to user's validated choices and send request to upload data to db.
    this.mapFile = function () {
        $(document).off('click', "#mapBtn").on('click', "#mapBtn", function () {
            for( let i = 0; i < $("#mapTable > tbody > tr").length; i++ ){
                if($("select." + i).val().length != 0){
                    mapHeaderObj[$("select."+i).val().trim()] = $("select."+i).attr('id').trim();
                }
            }
            if((mapHeaderObj["email"]) || (mapHeaderObj["contact"])){
                $("#mapObjTable").html("");
                $("#successMessageFile").html("Thank you for uploading a file.Your request will be processed soon...");
                $(document).scrollTop(0);
                _this.uploadUsersToDB();
                _this.showUsers();
                _this.showFiles();
                $("div#mapFileDiv").html("");
                $("div.showUserDiv").css("pointer-events","all");
            } else {
                $("#warningMessage").html("You must map csv header with either email or contact no.");
            }
        });
    }

    // Allow user revert back uploaded csv file
    this.cancelMapFile = function () {
        $(document).off('click', "#mapCancelBtn").on('click', "#mapCancelBtn", function () {
            $.ajax({
                url : '/api/deleteFile?fileName=' + $("p.fileUploaded").attr('id'),
                type : 'get',
                headers: {
                    'authToken': document.cookie.split("=")[1]
                },
                success : function(res) {
                    if(res.code == 200){
                        $("#mapFileDiv").html("");
                        $("div.showUserDiv").css("pointer-events","all");
                        $("#importForm")[0].reset();
                        mapHeaderObj = {}
                    } else {
                        $("#warningMessage").html(res.message);
                    }
                }
            });

        });
    }

    // Allow user to revert back map choices for file
    this.cancelMapChoices = function () {
        $(document).off('click', "#cancelBtn").on('click', "#cancelBtn", function () {
            $("#mapObjTable").html("");
            $("#warningMessage").html("");
            $("div.showUserDiv").css("pointer-events","all");
            mapHeaderObj = {}
        });
    }

    // Allow user to confirm the map choices.
    this.confirmMapChoices = function () {
        $(document).off('click', "#okBtn").on('click', "#okBtn", function () {
            $("#mapObjTable").html("");
            $("#successMessageFile").html("Thank you for uploading a file.Your request will be processed soon...");
            $(document).scrollTop(0);
            _this.uploadUsersToDB();
            _this.showUsers();
            _this.showFiles();
            $("div#mapFileDiv").html("");
            $("div.showUserDiv").css("pointer-events","all");
        });
    }

    // Send request to validate and upload user data.
    this.uploadUsersToDB = function () {
        $.ajax({
            url : '/api/uploadUsersToDB?fileUploaded=' + $("p.fileUploaded").attr('id') + '&hasHeaders=' + $("#hasHeaders").prop('checked'),// + "&fileId=" + $("p.fileId").attr('id'),
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
                    $("#successMessageFile").html(`<button class="btn btn-secondary" id="messageClose"><h6>X<h6></button><br>Thank you for uploading a file.Your request will be processed soon...`);
                    _this.showUsers();
                    _this.showFiles();
                    $("#importForm")[0].reset();
                }
            }
        });
    }

    // Allow user to remove error and success messages from UI.
    this.cancelMessage = function () {
        $(document).off('click', "#messageClose").on('click', "#messageClose", function () {
            $("#warningMessage").html("");
            $("#errorMessageFile").html("");
            $("#successMessageFile").html("");
        });
    }

    this.socketEventListeners = function () {

        socket.on("fileProcessStarted", () => {
            console.log("dddeeemmmooo");
            $.notify("We are starting processing pending requests...     ", "info", { position:"right" });
        });

        socket.on("fileInProgress", (csvFileId, csvFileName) => {
            $("td#"+csvFileId).html('in progress').attr("class","text-info");
            $.notify("We are processing " + csvFileName + " file now...     ", "warn");
            $("td#"+csvFileId).append(`<div class="progress">
                                            <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>`);
        });

        socket.on("fileProgressPersentage", (progressPercentage, csvFileId) => {
            if(progressPercentage != null){
                $("div.progress-bar").css("width", ""+parseInt(progressPercentage)+"%").prop("aria-valuenow", ""+parseInt(progressPercentage)).html(""+ parseInt(progressPercentage) +"%");
            }
        });

        socket.on("fileUploaded", (csvFileId, csvFileName) => {
            $("td#"+csvFileId).html('uploaded').attr("class","text-success");
            $.notify("We have successfully uploaded " + csvFileName + " file...     ", "success");
            $("div.progress-bar").remove();
            this.showUsers();
            this.showFiles(); 
        });
    }

    let _this = this;
    let mapHeaderObj = {};
    var socket = io.connect('http://127.0.0.1:3001', {secure: true,    rejectUnauthorized: false , transports : ['websocket']});
    this.init();    
}