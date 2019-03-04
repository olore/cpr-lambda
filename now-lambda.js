'use strict';
let https = require ('https');

// https://westcentralus.api.cognitive.microsoft.com/text/analytics
// https://westcentralus.api.cognitive.microsoft.com/text/analytics
// https://westcentralus.api.cognitive.microsoft.com/text/analytics
// Key 1: b3d3818c7c844f5996a2a62ec6e0d70b
// Key 2: 95b375ffc4d44eac803fab2e67b654d5

const {json} = require('micro');

module.exports = async (req, res) => {
	const data = await json(req);
	console.log(data);
  let commentText = data.text;
  let documents = {
    documents: [
      { 
        'id': '1', 
        'language': 'en', 
        'text': commentText
      }
    ]
  };

  return get_sentiments (documents, function(resp) {
    console.log('finally got', resp);
    let obj = JSON.parse(resp);
    res.end(JSON.stringify({score: obj.documents[0].score}));

  });

}


// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the accessKey string value with your valid access key.
let accessKey = 'b3d3818c7c844f5996a2a62ec6e0d70b';

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace 
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.
let uri = 'westcentralus.api.cognitive.microsoft.com';
let path = '/text/analytics/v2.0/sentiment';

let response_handler = function (response, cb) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
        let body_ = JSON.parse (body);
        let body__ = JSON.stringify (body_, null, '  ');
        console.log (body__);
        cb(body__);
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};

let get_sentiments = function (documents, cb) {
    let body = JSON.stringify (documents);

    let request_params = {
        method : 'POST',
        hostname : uri,
        path : path,
        headers : {
            'Ocp-Apim-Subscription-Key' : accessKey,
        }
    };

    let req = https.request (request_params, function(x) {
      response_handler(x, cb);
    });
    req.write (body);
    req.end ();
}

