var aws = require('aws-sdk');
// var cred = require('./lib/cred')
//var email = require('./lib/email');

var s3 = new aws.S3();
var sns = new aws.SNS();

module.exports.list = (event, context, callback) => {
  console.log("Incoming: ", event);
  console.log("------------------");

  var params = {
    Bucket: 'ksounds',
    Delimiter: "/",
    Prefix: event.prefix,
  };

  s3.listObjects(params, function (err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {

      const folderPath = params.Prefix.split('/');
      const levels = folderPath.length;
      let parent = folderPath.slice(0, levels - 2).join('/');
      if (parent) parent += "/";


      // const files = data.Contents.map(c => c.Key);
      const files = {
        parent: parent, //,
        files: data.Contents.map(c => c.Key),
        folders: data.CommonPrefixes,
      };

      console.log(files); // successful response

      const response = {
        statusCode: 200,
        body: JSON.stringify(files),
      };

      // sns.publish({
      //   Message: 'Test publish to SNS from Lambda',
      //   TopicArn: 'arn:aws:sns:us-east-1:417440916433:komposer-test'
      // }, function (err, data) {
      //   context.done(err, response);
      // });

        context.done(null, response);


    }
  });

};