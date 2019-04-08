// This is a place holder for the initial application state.
const state = {
  "wiki": "Emu",
};

const example_wikipedia_api_res = {
  "parse": {
      "title": "Emu",
      "pageid": 76894,
      "sections": [
          {
              "toclevel": 1,
              "level": "2",
              "line": "Taxonomy",
              "number": "1",
              "index": "1",
              "fromtitle": "Emu",
              "byteoffset": 5352,
              "anchor": "Taxonomy"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "History",
              "number": "1.1",
              "index": "2",
              "fromtitle": "Emu",
              "byteoffset": 5366,
              "anchor": "History"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Systematics",
              "number": "1.2",
              "index": "3",
              "fromtitle": "Emu",
              "byteoffset": 11827,
              "anchor": "Systematics"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Description",
              "number": "2",
              "index": "4",
              "fromtitle": "Emu",
              "byteoffset": 18083,
              "anchor": "Description"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Distribution and habitat",
              "number": "3",
              "index": "5",
              "fromtitle": "Emu",
              "byteoffset": 24592,
              "anchor": "Distribution_and_habitat"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Behaviour and ecology",
              "number": "4",
              "index": "6",
              "fromtitle": "Emu",
              "byteoffset": 25788,
              "anchor": "Behaviour_and_ecology"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Diet",
              "number": "4.1",
              "index": "7",
              "fromtitle": "Emu",
              "byteoffset": 31241,
              "anchor": "Diet"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Breeding",
              "number": "4.2",
              "index": "8",
              "fromtitle": "Emu",
              "byteoffset": 35817,
              "anchor": "Breeding"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Predation",
              "number": "4.3",
              "index": "9",
              "fromtitle": "Emu",
              "byteoffset": 47238,
              "anchor": "Predation"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Parasites",
              "number": "4.4",
              "index": "10",
              "fromtitle": "Emu",
              "byteoffset": 49674,
              "anchor": "Parasites"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Relationship with humans",
              "number": "5",
              "index": "11",
              "fromtitle": "Emu",
              "byteoffset": 50668,
              "anchor": "Relationship_with_humans"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Economic value",
              "number": "5.1",
              "index": "12",
              "fromtitle": "Emu",
              "byteoffset": 53622,
              "anchor": "Economic_value"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Cultural references",
              "number": "5.2",
              "index": "13",
              "fromtitle": "Emu",
              "byteoffset": 63246,
              "anchor": "Cultural_references"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Status and conservation",
              "number": "6",
              "index": "14",
              "fromtitle": "Emu",
              "byteoffset": 68834,
              "anchor": "Status_and_conservation"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "See also",
              "number": "7",
              "index": "15",
              "fromtitle": "Emu",
              "byteoffset": 71339,
              "anchor": "See_also"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Notes",
              "number": "8",
              "index": "16",
              "fromtitle": "Emu",
              "byteoffset": 71471,
              "anchor": "Notes"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "References",
              "number": "9",
              "index": "17",
              "fromtitle": "Emu",
              "byteoffset": 71499,
              "anchor": "References"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "External links",
              "number": "10",
              "index": "18",
              "fromtitle": "Emu",
              "byteoffset": 71645,
              "anchor": "External_links"
          }
      ]
  }
}

const thumbnail_url = id => {return 'http://i3.ytimg.com/vi/'+id+'/maxresdefault.jpg'};
const video_url = id => {return 'https://youtube.com/watch?v='+id};

let example_videos = [
  {
    "id": "BXpu6tbFCsI",
    "title": "Emu War - OverSimplified (Mini-Wars #4)",
    "likes": 3
  },
  {
    "id": "yb2Y2rcgnCw",
    "title": "Emus in the House | Kangaroo Dundee",
    "likes": 2
  },
  {
    "id": "QOPZQHTNUs0",
    "title": "The Great Emu War",
    "likes": 14
  },
];

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

class VideoLikeButton extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      likes: props.likes, // when using the database this needs to be changed because we're only using a derived state here
      // so when using a database, there should be no need to set an initial state; this is just for PoC
      clickedFlag: false,
    }
  }

  handleLikeClick(){
    if (this.state.clickedFlag){
      this.setState(function(prevState, _) {
        return {
          likes: prevState.likes - 1,
          clickedFlag: !prevState.clickedFlag
        };
      })
    }
    else{
      this.setState(function(prevState, _) {
        return {
          likes: prevState.likes + 1,
          clickedFlag: !prevState.clickedFlag
        };
      })
    }
    
  }

  render(){

    let buttonTag = (this.state.clickedFlag) ? "btn-success" : "btn-light"

    return (
      <button type="button" className={`btn ${buttonTag}`} onClick={this.handleLikeClick.bind(this)}>
        Likes {this.state.likes}
      </button>
    )
  }
}

const Video = (props) => (
  <div className="card" style={{width: "18rem", float: "left", marginRight: "8px"}}>
    <a href={video_url(props.video.id)}><img className="card-img-top" src={thumbnail_url(props.video.id)} alt="Card image cap"></img></a>
    <div className="card-body">
      <h5 className="card-title">{props.video.title}</h5>
      <p className="card-text">Super dope video about the section</p>
      <a href="#" className="btn btn-primary">Go somewhere fun</a>
      <VideoLikeButton likes={props.video.likes} />
    </div>
  </div>
);

const AddVideoModal = (props) =>(
  <div>
    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#AddVideoModal">Add Video</button>

    <div className="modal fade" id="AddVideoModal" tabindex="-1" role="dialog" aria-labelledby="AddVideoModalTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="AddVideoModalTitle">Add Your Video</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <AddVideoForm parse={props.parse} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

class AddVideoForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      wikiID: props.parse.pageid,
      sections: props.parse.sections,
      selections : props.parse.sections.map(section => (
        <Selection key={section.index} section={section} />
      ))
    };
    this.handleAddVidoe = this.handleAddVidoe.bind(this);
  }

  handleAddVidoe(e){
    e.preventDefault();
    let form = document.forms.videoAdd;
    const submitReq = {
      "video":{
				"wikiPageId": this.state.wikiID,
				"sectionIdx": form.wikiPageContentIndex.value,
				"ytId": form.videoID.value
			}
    }
    fetch('/api/videos', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitReq),
    })
    .then(res => res.json())
    .then(json => {
      console.log(json.success);
      if (json.success) {
        alert(json.msg);
      }
      else {
        alert('Failed to add video.\n Error description: ' + json.msg);
      }
    });
  }

  render(){
    return(
      <div>
        <form name="videoAdd" onSubmit={this.handleAddVidoe}>
          <div className="form-group">
            <label for="videoID">Youtube Video ID</label>
            <input type="text" className="form-control" id="videoID" placeholder="The 11 Digit code after watch?v="></input>
          </div>
          <div className="form-group">
            <label for="wikiPageContentIndex">Choose The Content Section You Want To Submit</label>
            <select className="form-control" id="wikiPageContentIndex">
              {this.state.selections}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
}

const Selection = (props) =>(
  <option value={props.section.index}>{props.section.index}. {props.section.line}</option>
)



function Section(props) {
  const CustomHeader = `h${props.section.level}`;
  const videos = example_videos.map(video => (
    <Video key={video.id} video={video} />
  ));
  return (
    <div className="container" style={{paddingBottom: '15px', marginBottom: '15px', borderBottom: "1px solid grey"}}>
      <div className="row">
        <CustomHeader>{props.section.line}</CustomHeader>
        <hr/>
        <div className="col-12" style={{"overflowX": "auto"}}>
          {videos}
        </div>
      </div>
    </div>
  );
}

function WikiPage(props) {
  const sections = props.sections.map(section => (
    <Section key={section.index} section={section} />
  ));
  return (
    <div>{sections}</div>
  );
}

class ContentPage extends React.Component {
  constructor() {
    super();
    this.state = { sections: example_wikipedia_api_res.parse.sections,
      parse: example_wikipedia_api_res.parse};
  }

  render() {
    return (
      <div className="container">
        <h1>Content Page</h1>
        <hr />
        <AddVideoModal parse={this.state.parse} />
        <hr />
        <WikiPage sections={this.state.sections} />
      </div>
    );
  }
}

// This renders the JSX component inside the content node:
ReactDOM.render(<ContentPage />, contentNode);
