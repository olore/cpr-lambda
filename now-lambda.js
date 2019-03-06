'use strict';
const {json} = require('micro');

var vfile = require('to-vfile')
var unified = require('unified')
var english = require('retext-english')
var sentiment = require('retext-sentiment')
var tmp = require('tmp');

var processor = unified()
  .use(english)
  .use(sentiment)

module.exports = async (req, res) => {
	const data = await json(req);
  let commentText = data.text;

  let tmpobj = tmp.fileSync();
  let filename = tmpobj.name;
  let file = vfile({path: filename, contents: commentText})

  let tree = processor.parse(file)
  processor.run(tree, file)
  // console.log(tree.data); // { polarity: -4, valence: 'negative' }

  let score = 0;
  switch(tree.data.polarity) {
    case -5: 
      score = 0;
      break;
    case -4: 
      score = 0.10;
      break;
    case -3: 
      score = 0.20;
      break;
    case -2: 
      score = 0.30;
      break;
    case -1: 
      score = 0.40;
      break;
    case 0: 
      score = 0.50;
      break;
    case 1: 
      score = 0.60;
      break;
    case 2: 
      score = 0.70;
      break;
    case 3: 
      score = 0.80;
      break;
    case 4: 
      score = 0.90;
      break;
    case 5: 
    case 6:  // "i love this. it's the best" (sposta only go up to 5!)
      score = 1.00;
      break;
  }
  res.end(JSON.stringify({score: score}));

}