const nodemailer = require("nodemailer");

exports.sendMailService = async function(receiverMailAddress, mailText){
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ravi.malaviya.3795@gmail.com", // generated ethereal user
          pass: "ravi@3795", // generated ethereal password
        },
      });
    
      var mailOptions = {
        from: '"Dipesh\'s fake account" <dipesh.fakemail@gmail.com>',
        to: receiverMailAddress,
        subject: "A link to download requested CSV file",
        text : "Here you go...",
        html : "<a href='"+ mailText +"'>Click here to download</a>"
        // text : "http://192.168.1.112:3000/csvFiles/" + fileName
      };
    
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return false;
          // console.log(error);
          // res.json({status : "error", error : "There was an error while processing your request..."});
        } else {
          return true;
          // console.log("Email has been sent: " + info.response);
          // res.json({status : "success"});
    
        }
    });
}
