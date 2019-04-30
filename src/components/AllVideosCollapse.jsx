import React from 'react';
import VideoReactionButtons from './VideoReactionButtons.jsx'

const thumbnail_url = id => { return 'http://i3.ytimg.com/vi/' + id + '/hqdefault.jpg' };
const video_url = id => { return 'https://youtube.com/watch?v=' + id };

const truncate_str = (str, len) => {
    if (str.length < len) { return str; }
    return str.substring(0, len-3) + "..."
}

export default class AllVideosCollapse extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
    }
    render(){
        return(
            <div className="col-12" style={{ "overflowX": "auto", 'marginTop': '15px' }}>
                <div className="accordion">
                <div className="card">
                    <div className="card-header" style={{ 'cursor': 'pointer' }} data-toggle="collapse" data-target={`#collapse${this.props.index}`} aria-expanded="true" aria-controls="collapseOne">
                    <h2 className="mb-0" style={{ textAlign: 'center' }}>
                        <button className="btn btn-link" type="button" >
                        View All Videos
                        </button>
                    </h2>
                    </div>
                    <div id={`collapse${this.props.index}`} className="collapse" >
                    <div className="card-body row">
                        {this.props.videos.map((video, index) => {
                            return (
                                <div key={video.ytId} className='col-12' style={{ height: '100px', marginTop: '5px' }}>
                                <a href={video_url(video.ytId)}><img style={{ height: '100px' }} src={thumbnail_url(video.ytId)}></img></a>
                                <span style={{ marginLeft: '10px' }}>{truncate_str(video.title, 62)}</span>
                                <div style={{ float: 'right', marginTop: '25px' }}>
                                    <VideoReactionButtons style={{ float: 'right' }} upvotes={video.upvotes} downvotes={video.downvotes} videoInfo={video}/>
                                </div>
                                </div>
                            )
                        })}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}