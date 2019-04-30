import React from 'react';
import Navbar from './components/Navbar.jsx';
import AllVideosCollapse from './components/AllVideosCollapse.jsx';
import VideoCard from './components/VideoCard.jsx';


const AddVideoModal = (props) => (
  <div>
    <div id="buttonOnRight">
      <a href={`https://en.wikipedia.org/wiki/?curid=${props.wikiID}`} target="_blank" className="btn btn-outline-primary" style={{marginRight: '8px'}}>Go to Wikipedia Page</a>
      <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#AddVideoModal">Add Video</button>
    </div>
    <div className="modal fade" id="AddVideoModal" tabIndex="-1" role="dialog" aria-labelledby="AddVideoModalTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="AddVideoModalTitle">Add Your Video</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div className="modal-body">
            <AddVideoForm wikiID={props.wikiID} sections={props.sections} addVideo={props.addVideo} />
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
  constructor(props) {
    super(props);
    this.state = {
      wikiID: props.wikiID,
      sections: props.sections,
      selections: props.sections.map(section => (
        <Selection key={section.index} section={section} />
      ))
    };
    this.handleAddVidoe = this.handleAddVidoe.bind(this);
  }

  handleAddVidoe(e) {
    e.preventDefault();
    let form = document.forms.videoAdd;
    const submitReq = {
      "video": {
        "wikiPageId": parseInt(this.state.wikiID),
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
          this.props.addVideo(json.video);
        }
        else {
          alert('Failed to add video.\n Error description: ' + json.msg);
        }
      });
  }

  render() {
    return (
      <div>
        <form name="videoAdd" onSubmit={this.handleAddVidoe}>
          <div className="form-group">
            <label htmlFor="videoID">Youtube Video ID</label>
            <input type="text" className="form-control" id="videoID" placeholder="The 11 Digit code after watch?v="></input>
          </div>
          <div className="form-group">
            <label htmlFor="wikiPageContentIndex">Choose The Content Section You Want To Submit</label>
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

const Selection = (props) => (
  <option value={props.section.index}>{props.section.index}. {props.section.line}</option>
)

function Section(props) {
  const CustomHeader = `h${props.section.level}`;

  let cardVideos = props.videos.slice(0, 3);
  const videoCards = cardVideos.map(video => (
    <VideoCard key={video.ytId} video={video} />
  ));
  let allVideosCollapse =  (props.videos.length > 3) ? <AllVideosCollapse index={props.section.index} videos={props.videos} /> : "";
  return (
    <div className="container" style={{ paddingBottom: '15px', marginBottom: '15px', borderBottom: "1px solid grey" }}>
      <div className="row">
        <CustomHeader dangerouslySetInnerHTML={{__html: props.section.line}}></CustomHeader>
        <hr />
        <div className="col-12" style={{ "overflowX": "auto" }}>
          {videoCards}
        </div>
        {allVideosCollapse}
      </div>
    </div>
  );
}

function WikiPage(props) {
  const sections = props.sections.map(section => (
    <Section key={section.index} section={section} videos={props.videos.filter(videoObject => videoObject.sectionIdx == section.index)} />
  ));
  return (
    <div>{sections}</div>
  );
}

export default class ContentPage extends React.Component {
  constructor(props) {
    super(props);
    // TODO: need to add upvotes downvotes and add title to page from wiki API

    this.state = {
      wikiID: this.props.params.wikiPageId,
      videos: [],
    };

    this.loadWikiData = this.loadWikiData.bind(this);
    this.loadAbaxaciData = this.loadAbaxaciData.bind(this);
    this.addVideo = this.addVideo.bind(this);
    this.handleNavbarSearch = this.handleNavbarSearch.bind(this);
  }

  componentDidMount() {
    this.loadWikiData();
    this.loadAbaxaciData();
  }

  loadWikiData() {
    let wikiID = this.state.wikiID;
    let wikiLink = `https://en.wikipedia.org/w/api.php?origin=*&action=parse&format=json&pageid=${wikiID}&prop=sections`
    fetch(wikiLink)
      .then(res => {
        if (res.ok) {
          res.json().then(json => {
            let newSections = json.parse.sections;
            newSections.unshift({
              "index": "0",
              "line": json.parse.title,
              "level": "1"
            })
            this.setState({ sections: newSections });
          })
        }
      });
  }
  loadAbaxaciData() {
    let wikiID = this.state.wikiID;
    fetch("api/videos/" + wikiID.toString())
      .then(res => {
        if (res.ok) {
          res.json().then(json => {
            this.setState({ videos: json.videos });
          });
        }
      }).catch(err => {
        alert("There was a problemo: " + err.message)
      });
  }
  addVideo(video) {
    this.state.videos.push(video);
    this.setState({ videos: this.state.videos });
  }

  handleNavbarSearch(e) {
    e.preventDefault();
    let form = document.forms.navbarSearchForm;
    this.props.router.push({ pathname: '/search/' + encodeURIComponent(form.searchQuery.value) });
  }

  render() {
    let loadingHeader = <h1> Loading ... </h1>
    let wikiPresentation = (this.state.sections != null) ? <WikiPage sections={this.state.sections} videos={this.state.videos} /> : loadingHeader
    let videoModal = (this.state.sections != null) ? <AddVideoModal sections={this.state.sections} wikiID={this.state.wikiID} addVideo={this.addVideo} /> : loadingHeader

    return (
      <div>
        <Navbar handleNavbarSearch={this.handleNavbarSearch} />
        <div className="container page-contents">
          {videoModal}
          {wikiPresentation}
        </div>
      </div>
    );
  }
}

ContentPage.propTypes = {
  params: React.PropTypes.object.isRequired,
};

