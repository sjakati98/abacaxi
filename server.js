const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); //fetch API module for node.js(apparently doesn't automatically support it?)
const url = require('url'); //url module to construct URL using specified params
const URLSearchParams = url.URLSearchParams;
const URL = url.URL;

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

const ytApiParams = {
  method: "GET",
  headers: {
            Accept: 'application/json'
          },
}; //constant parameters for the ytapi, including the method and what type of response we accept(see yt api docs)

const ytApiKey = "AIzaSyCCnoDp8ullFubmLqfEJdbs5EmmQ37mu2s"; //hardcoded auth key for YT API I made

const ytApiUrl = new URL("https://www.googleapis.com/youtube/v3/videos?"); //specific endpoint we need to hit for youtube video data


/*
Request Type: GET
Endpoint: /api/videos/:id
Params: Wikipedia page id
Returns: list of videos

Example Endpoint: /api/videos/76894
Example Return:
		{
    "success": true,
    "msg": "Successfully found list of videos for Wiki Page with id: 76894"
    "videos": [
        {
            "wikiPageId": 76894,
            "sectionIdx": 3,
            "ytId": "Bxpu6tbFCsI",
            "title": "Emu War - OverSimplified (Mini-Wars #4)",
            "upvotes": 3,
            "downvotes": 0
        },
        ...
    ],
    "count": 3
*/

app.get('/api/videos/:id', (req,res) => {
  let wikiId = parseInt(req.params.id,10); //converting from string to number
  
  db.collection('videos').find({wikiPageId: wikiId}).count().then(count => {
    if(count == 0) {
      res.json({
        success: true,
        msg: `No videos for wikiPage: ${wikiId} found!`, 
        videos: [],
        count: count
      });

    }
    else {
      db.collection('videos').find({wikiPageId: wikiId}).toArray().then(pageVideos => {
        let reconstructedVideos = [];
        pageVideos.forEach(video => {
          reconstructedVideos.push({
            wikiPageId: video.wikiPageId,
            sectionIdx: video.sectionIdx,
            ytId: video.ytId, //Update REST API Spec Document
            title: video.title,
            upvotes: video.upvotes,
            downvotes: video.downvotes
          })
        });
        res.json({
          success: true,
          msg: `Successfully found list of videos for Wiki Page with id:${wikiId}`,
          videos: reconstructedVideos, 
          count: count,
        });
      });
    }
  
  }
  ).catch(error => {
    console.log(error);
    res.json({
      success: false,
      msg: `Error in parsing GET request to /api/videos/${wikiId}: ${error}`,
      videos: [],
      count: -1
    });
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
    "msg": "Video "5 must have skills to become a programmer (that you didn't know)" successfully submitted!",
    "video": {
        "wikiPageId": 76895,
        "sectionIdx": 7,
        "ytId": "3MtrUf81k6c",
        "title": "5 must have skills to become a programmer (that you didn't know)",
        "upvotes": 0,
        "downvotes": 0
    }
}
			
Upon failure:
{
    "success": false,
    "msg": "Video already exists in the system!",
    video: {}
}
*/

app.post('/api/videos', (req,res) => {
  let newVideo = req.body.video;

  //first we search the database to see if the video object already exists
  db.collection('videos').find({wikiPageId: newVideo.wikiPageId, sectionIdx: newVideo.sectionIdx, ytId: newVideo.ytId}).count().then(count => {
    if(count != 0){ //if it already exists, we don't add it
      res.json({
        success: false, //if we don't add it, we set the response body success property to false
        msg: "Video already exists in the system!",
        video: {}
      })
    }
    else{ //If it isn't already in the database, we add it
     
      ytUrl = buildUrl(newVideo.ytId); //building the api endpoint we need to GET from using query parameters

      fetch(ytUrl,ytApiParams).then(data => {return data.json()}).then(response => { //querying the Youtube API
        let title = response.items[0].snippet.title; //title from the Youtube video API
        newVideo.title = title;
        newVideo.created = new Date(); //adding and initializing parameters
        newVideo.upvotes = 0;
        newVideo.downvotes = 0;

        db.collection('videos').insertOne(newVideo).then(result => //Adding it to our collection
          db.collection('videos').find({_id: result.insertedId}).limit(1).next() //finding it again to return it as part of the JSON
        ).then(newVideo => {
          res.json({
            success: true, //if we do add it, we set the response body success property to true
            msg: `Video '${newVideo.title}' successfully submitted!`,
            video: {
              wikiPageId: newVideo.wikiPageId,
              sectionIdx: newVideo.sectionIdx,
              ytId: newVideo.ytId, //constructs simplified video object to be returned to client with only necessary information,
              title: newVideo.title,
              upvotes: newVideo.upvotes,
              downvotes: newVideo.downvotes
            }
          }
          );
        }).catch(error => {
          console.log(error);
          res.json({
            success:false,
            msg:`Error in parsing POST request to /api/videos/ with video youtube id ${newVideo.ytId} and wikipage id ${newVideo.wikiPageId}: ${error}`,
            video: {}
          });
        });
      }).catch(error => {
        console.log(error);
        res.json({
          success:false,
          msg:`Error in parsing POST request to /api/videos/ with video youtube id ${newVideo.ytId} and wikipage id ${newVideo.wikiPageId}: ${error}`,
          video: {}
        });
      })
    }
  });
});

/*

Request Type: PUT 
Endpoint: /api/videos/
Params: video object with specified properties wikiPageId, sectionIdx, ytId and new property upvote(boolean, true for upvote, false for downvote), specifying upvote or downvote
Returns: exact same object upon success
Actual increment of upvote is client-side, but refreshing the page should show no change after upvoting
Example:
Request example:
{
	"video":{
		"wikiPageId": 7689,
		"sectionIdx": 7,
		"ytId": "3MtrUf81k6c",
		"upvote": true
}
}
Response example:
{
    "success": true,
    "msg": "Video successfully upvoted/downvoted!"
    "video": {
        "wikiPageId": 76895,
        "sectionIdx": 7,
        "ytId": "3MtrUf81k6c",
        "title": "5 must have skills to become a programmer (that you didn't know)",
        "upvotes": 6,
        "downvotes": 1
    }
}

previously, upvotes was 5. Downvotes would be 2 and upvotes would be 5 if upvote in request body was set to false.

Upon failure:
{
    "success": false,
    "msg": "Video does not exist in the system!",
    "video": {}
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
      res.json({
        success: false,
        msg: "Video does not exist in the system!",
        video: {}
      });
    }
    else{ //if we do find it
      db.collection('videos').find({wikiPageId: video.wikiPageId, sectionIdx: video.sectionIdx, ytId: video.ytId}).limit(1).next() //finding the updated video again
      .then(updatedVideo => {
        res.json({
          success: true, //true because we could update it
          msg: "Video successfully upvoted/downvoted!",
          video: {
            wikiPageId: updatedVideo.wikiPageId,
            sectionIdx: updatedVideo.sectionIdx,
            ytId: updatedVideo.ytId, //reconstructing it to send using response body,
            title: updatedVideo.title,
            upvotes: updatedVideo.upvotes,
            downvotes: updatedVideo.downvotes
          }
        });
      })
    }
  }).catch(error => {
    console.log(error);
    res.json({
      success:false,
      msg: `Error in parsing PUT request to /api/videos/update with video youtube id ${video.ytId} and wikipage id ${video.wikiPageId}: ${error}`,
      video: {}
    });
  });
});


const buildUrl =  (id) => {
  let ytApiSearchParams = new URLSearchParams(ytApiUrl.search);
  ytApiSearchParams.append("key",ytApiKey);
  ytApiSearchParams.append("part","snippet"); //Constructing specific endpoint URL for specific video we need to hit
  ytApiSearchParams.append("id",id);          //Example: https://www.googleapis.com/youtube/v3/videos?part=snippet&id=3MtrUf81k6c&key=AIzaSyCCnoDp8ullFubmLqfEJdbs5EmmQ37mu2s
  return ytApiUrl + ytApiSearchParams.toString();
}; //Using the URL module 
