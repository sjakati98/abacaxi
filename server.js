const express = require('express');

const app = express();
const bodyParser = require('body-parser');

app.use(express.static('static'));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;

let db;
MongoClient.connect('mongodb://localhost', { useNewUrlParser: true }).then(connection => {
  db = connection.db('abacaxi');
  app.listen(3000, () => {
    console.log('App started on port 3000');
  });
}).catch(error => {
  console.log('ERROR:', error);
});


/*
Request Type: GET
Endpoint: /api/videos/:id
Params: Wikipedia page id
Returns: list of videos
Ex:
		{
    "videos": [
        {
            "_id": "5ca41e15346f29bdff6dd083",
            "wikiPageId": 76894,
            "sectionIdx": 3,
            "created": "2016-08-15T00:00:00.000Z",
            "ytId": "Bxpu6tbFCsI",
            "title": "Emu War - OverSimplified (Mini-Wars #4)",
            "upvotes": 3,
            "downvotes": 0
        },
...
*/

app.get('/api/videos/:id', (req,res) => {
  let wikiId = parseInt(req.params.id,10); //converting from string to number
  db.collection('videos').find({wikiPageId: wikiId}).toArray().then(pageVideos => { //finds all video objects pertaining to a page, converts it to an array 
    res.json({videos: pageVideos}) //returns list of videos of that pageId, empty if either the pageId doesn't exist or there are no videos currently for it
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Error in parsing GET request to /api/videos/${wikiId}: ${error}`});
  });
});


/*
Request Type: POST
Endpoint: /api/videos
Params: video object
If no video object present with same values, create new video document and return it with new properties upvote and downvote, and success = true
Else, return success = false
Returns: id of updated document
Request Body Ex:
		{
			"video":{
				"wikiPageId": 76895,
				"sectionIdx": 7,
				"ytId": "abcd"
			}
}
Response Body Ex:
Upon success:
{
    "success": true,
    "video": {
        "wikiPageId": 76895,
        "sectionIdx": 7,
        "ytId": "abcd",
        "upvotes": 0,
        "downvotes": 0
    }
}
			
Upon failure:
{
    "success": false
}
*/

app.post('/api/videos', (req,res) => {
  let newVideo = req.body.video;

  //first we search the database to see if the video object already exists
  db.collection('videos').find({wikiPageId: newVideo.wikiPageId, sectionIdx: newVideo.sectionIdx, ytId: newVideo.ytId}).count().then(count => {
    if(count != 0){ //if it already exists, we don't add it
      res.json({
        success: false //if we don't add it, we set the response body success property to false
      })
    }
    else{ //if it does exist
      // Adding/reassigning/initializing properties of video object to be added to our collection
      newVideo.created = new Date();
      newVideo.upvotes = 0;
      newVideo.downvotes = 0;
      db.collection('videos').insertOne(newVideo).then(result => //Adding it to our collection
        db.collection('videos').find({_id: result.insertedId}).limit(1).next() //finding it again to return it as part of the JSON
      ).then(newVideo => {
        res.json({
          success: true, //if we do add it, we set the response body success property to true
          video: {
            wikiPageId: newVideo.wikiPageId,
            sectionIdx: newVideo.sectionIdx,
            ytId: newVideo.ytId, //constructs simplified video object to be returned to client with only necessary information
            upvotes: newVideo.upvotes,
            downvotes: newVideo.downvotes
          }
        }
        );
      }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Error in parsing POST request to /api/videos/ with video youtube id ${newVideo.ytId} and wikipage id ${newVideo.wikiPageId}: ${error}`});
      });
    }
  });
});

/*

Request Type: POST 
Endpoint: /api/videos/update
Params: video object with specified properties wikiPageId, sectionIdx, ytId and new property upvote(boolean, true for upvote, false for downvote), specifying upvote or downvote
Returns: exact same object upon success
Actual increment of upvote is client-side, but refreshing the page should show no change after upvoting
Example:
Request example:
{
	"video":{
		"wikiPageId": 7689,
		"sectionIdx": 7,
		"ytId": "abcd",
		"upvote": true
}
}
Response example:
{
    "success": true,
    "video": {
        "wikiPageId": 76895,
        "sectionIdx": 7,
        "ytId": "abcd",
        "upvotes": 6,
        "downvotes": 1
    }
}
previously, upvotes was 5. Downvotes would be 2 and upvotes would be 5 if upvote in request body was set to false.
Upon failure:
{
    "success": false
}

*/

app.put('/api/videos',(req,res) => {
  let video = req.body.video;
  let field; //field to update
  if(video.upvote) { field = "upvotes"; } //if upvote is set to true, we will increment the upvotes field by 1 and vice versa for false
  else { field = "downvotes"; }

  db.collection('videos').updateOne(
    {wikiPageId: video.wikiPageId, sectionIdx: video.sectionIdx, ytId: video.ytId}, //finding the video
    { $inc: {[field]: 1}} //incrementing the field
  ).then(result => {
    if(result.matchedCount === 0 || result.modifiedCount === 0) { //if no video object matches what we are trying to update, we just set success to false and return that
      res.json({success: false});
    }
    else{ //if we do find it
      db.collection('videos').find({wikiPageId: video.wikiPageId, sectionIdx: video.sectionIdx, ytId: video.ytId}).limit(1).next() //finding the updated video again
      .then(updatedVideo => {
        res.json({
          success: true, //true because we could update it
          video: {
            wikiPageId: updatedVideo.wikiPageId,
            sectionIdx: updatedVideo.sectionIdx,
            ytId: updatedVideo.ytId, //reconstructing it to send using response body
            upvotes: updatedVideo.upvotes,
            downvotes: updatedVideo.downvotes
          }
        });
      })
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Error in parsing POST request to /api/videos/update with video youtube id ${video.ytId} and wikipage id ${video.wikiPageId}: ${error}`});
  });
});
