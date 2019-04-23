const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); //fetch API module for node.js(apparently doesn't automatically support it?)
const url = require('url'); //url module to construct URL using specified params
const URLSearchParams = url.URLSearchParams;
const URL = url.URL;

const app = express();

app.use(express.static('static'));
app.use(bodyParser.json());

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
//TODO: GET should return top x number of videos with highest upvotes-downvotes number

//GET VIDEOS ENDPOINT
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
        let sortedAndFilteredVideos = sortAndFilterVideos(reconstructedVideos);
        res.json(constructResponse(true,`Successfully found list of videos for Wiki Page with id: ${wikiId}`, {videos: sortedAndFilteredVideos, count: sortedAndFilteredVideos.length}));
      });
    }
  }).catch(error => {
    console.log(`Error in parsing GET request to /api/videos/${wikiId}: ${error}`);
    res.json(constructResponse(false, `There was an error with retrieving the videos for this page. Sorry!`, {videos: [], count: -1}));
  }); 
});

//CREATE VIDEO ENDPOINT
app.post('/api/videos', (req,res) => {
  let newVideo = req.body.video;

  //first we search the database to see if the video object already exists
  db.collection('videos').find({wikiPageId: newVideo.wikiPageId, sectionIdx: newVideo.sectionIdx, ytId: newVideo.ytId}).count().then(count => {

    //if it already exists, we don't add it
    if(count != 0) res.json(constructResponse(false, "This video for this specific page, topic and subsection already exists!", {video:{}}));
    else {
      ytUrl = buildUrl(newVideo.ytId); //building the api endpoint we need to GET from using query parameters 

      //querying the Youtube API
      fetch(ytUrl,ytApiParams).then(data => {return data.json()}).then(response => {
        //If the youtube ID they submit is invalid
        if(response.pageInfo.totalResults == 0|| response.pageInfo.resultsPerPage == 0) res.json(constructResponse(false, `The video ID you submitted is not a valid ID. Please re-check this information!`, { video:{} }));
        else {
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

//UPDATE VIDEO WITH DOWNVOTE/UPVOTE ENDPOINT
app.put('/api/videos',(req,res) => {
  let video = req.body.video;
  let field; //field to update
  let operation; //which operation, upvote or downvote to perform
  let value;

  let hasUpvote = video.hasOwnProperty("upvote");
  let hasDownvote = video.hasOwnProperty("downvote");

  if((hasUpvote && hasDownvote) || (!hasUpvote && !hasDownvote)){
    res.json(constructResponse(false, "Error: Request body is either missing property upvote/downvote or has both")); //enforcing property constraints
    return;
  }
  if(hasUpvote) {
    field = "upvotes"; //check the object for the property, use it to decide the action
    operation = "upvote";
  }
  else if(hasDownvote){ 
    field = "downvotes";
    operation = "downvote";
  }

  if(video[operation]) value = 1; //if the field is true, we increment, else decrement
  else value = -1;

  db.collection('videos').updateOne(
    {wikiPageId: video.wikiPageId, sectionIdx: video.sectionIdx, ytId: video.ytId}, //finding the video
    { $inc: {[field]: value}} //updating the field with the appropriate action
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

const getSectionIds = (videos) => {
  let sectionIDSet = new Set();
  videos.forEach(video => {
    sectionIDSet.add(video["sectionIdx"]);
  })
  return Array.from(sectionIDSet);
}

const sortAndFilterVideos = (videos) => {
  let sortedAndFilteredVideos = []
  let sectionIDList = getSectionIds(videos);
  sectionIDList.forEach(sectionID => {
    let sectionVideos = videos.filter(video => video["sectionIdx"] === sectionID);
    let sortedSectionVideos = sectionVideos.sort(compareVideos).reverse();
    sortedAndFilteredVideos = sortedAndFilteredVideos.concat(sortedSectionVideos.slice(0,3));
  });
  return sortedAndFilteredVideos;
}

const compareVideos = (v1,v2) => {
  let v1Score = v1["upvotes"] - v1["downvotes"];
  let v2Score = v2["upvotes"] - v2["downvotes"];
  return v1Score - v2Score;
}


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