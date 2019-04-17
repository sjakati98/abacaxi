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

//TODO: Require params for API for security
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
//TODO: GET should return top x number of videos with highest upvotes-downvotes number
app.get('/api/videos/:id', (req,res) => {
  let wikiId = parseInt(req.params.id,10); //converting from string to number
  
  db.collection('videos').find({wikiPageId: wikiId}).count()
  .then(count => {
    if(count == 0)  res.json(constructResponse(true,`No videos for wikiPage: ${wikiId} found!`, {videos: [], count:count})); 
    else {
      db.collection('videos').find({wikiPageId: wikiId}).toArray()
      .then(pageVideos => {
        let reconstructedVideos = [];
        pageVideos.forEach(video => reconstructedVideos.push(reconstructVideo(video)));
        res.json(constructResponse(true,`Successfully found list of videos for Wiki Page with id: ${wikiId}`, {videos: reconstructedVideos, count: count}));
      });
    }
  }).catch(error => {
    console.log(`Error in parsing GET request to /api/videos/${wikiId}: ${error}`);
    res.json(constructResponse(false, `There was an error with retrieving the videos for this page. Sorry!`, {videos: [], count: -1}));
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

    //if it already exists, we don't add it
    if(count != 0) res.json(constructResponse(false, "This video for this specific page, topic and subsection already exists!", {video:{}}));

    //If it isn't already in the database, then we add it
    else{
      ytUrl = buildUrl(newVideo.ytId); //building the api endpoint we need to GET from using query parameters 

      //querying the Youtube API
      fetch(ytUrl,ytApiParams).then(data => {return data.json()}).then(response => {
        //If the youtube ID they submit is invalid
        if(response.pageInfo.totalResults == 0|| response.pageInfo.resultsPerPage == 0) res.json(constructResponse(false, `The video ID you submitted is not a valid ID. Please re-check this information!`, { video:{} }));
    
        //If the ID is actually valid
        else{
          let title = response.items[0].snippet.title; //title from the Youtube video API //TODO: Don't make this hardcoded
          newVideo.title = title;
          newVideo.created = new Date(); //adding and initializing parameters
          newVideo.upvotes = 0;
          newVideo.downvotes = 0;

          db.collection('videos').insertOne(newVideo) //Adding it to our collection
          .then(result => db.collection('videos').find({_id: result.insertedId}).limit(1).next()) //finding it again to return it as part of the JSON
          .then(newVideo =>  res.json(constructResponse(true, `Video '${newVideo.title}' successfully submitted!`, {video: reconstructVideo(newVideo)})))
          .catch(error => {
                console.log(`Error in adding/retrieving video with ID: ${newVideo.ytId} and wikipage ID: ${newVideo.wikiPageId}: ${error}`);
                res.json(constructResponse(false, `There was an error inserting/retrieving the video you submitted from the database!`, {video: {}}));
            });
        }
      }).catch(error => {
        console.log(error);
        res.json(constructResponse(false, `There was an error fetching the title for the video you submitted from youtube!`, {video: {}}));
      })
    }
  }).catch(error => {
    console.log(error);
    res.json(constructResponse(false, `There was an error querying the database to validate your submission! Sorry!`, {video: {}}));
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
  )
  .then(result => {
    //if no video object matches what we are trying to update
    if(result.matchedCount === 0 || result.modifiedCount === 0) res.json(constructResponse(false, "Error: This video does not exist in the system!", { video:{} }));
    
    else{ //if we do find it
      db.collection('videos').find({wikiPageId: video.wikiPageId, sectionIdx: video.sectionIdx, ytId: video.ytId}).limit(1).next() //finding the updated video again
      .then(updatedVideo => {
        res.json(constructResponse(true, "Video successfully upvoted/downvoted!", {video: reconstructVideo(updatedVideo)}));
      })
    }
  }).catch(error => {
    console.log(`Error in parsing PUT request to /api/videos/update with video youtube id ${video.ytId} and wikipage id ${video.wikiPageId}: ${error}`);
    res.json(constructResponse(false, `There was an error updating the video upvote/downvote count! Sorry!`, {video: {}}));
  });
});


// Helpers/Constants

const buildUrl =  (id) => {
  let ytApiSearchParams = new URLSearchParams(ytApiUrl.search);
  ytApiSearchParams.append("key",ytApiKey);
  ytApiSearchParams.append("part","snippet"); //Constructing specific endpoint URL for specific video we need to hit
  ytApiSearchParams.append("id",id);          //Example: https://www.googleapis.com/youtube/v3/videos?part=snippet&id=3MtrUf81k6c&key=AIzaSyCCnoDp8ullFubmLqfEJdbs5EmmQ37mu2s
  return ytApiUrl + ytApiSearchParams.toString();
}; //Using the URL module 

const reconstructVideo = (dbVideo) => {
  let reconstructedVideo = {
    wikiPageId: dbVideo.wikiPageId,
    sectionIdx: dbVideo.sectionIdx,
    ytId: dbVideo.ytId, //reconstructing it to send using response body,
    title: dbVideo.title,
    upvotes: dbVideo.upvotes,
    downvotes: dbVideo.downvotes
  };
  return reconstructedVideo;
};

const constructResponse = (success, message, optionals) => {
  let responseObject = {
    success: success,
    msg: message
  };
  Object.keys(optionals).forEach(key => {
    responseObject[key] = optionals[key];
  })
  return responseObject;
};

const ytApiParams = {
  method: "GET",
  headers: {
            Accept: 'application/json'
          },
}; //constant parameters for the ytapi, including the method and what type of response we accept(see yt api docs)

const ytApiKey = "AIzaSyCCnoDp8ullFubmLqfEJdbs5EmmQ37mu2s"; //hardcoded auth key for YT API I made

const ytApiUrl = new URL("https://www.googleapis.com/youtube/v3/videos?"); //specific endpoint we need to hit for youtube video data