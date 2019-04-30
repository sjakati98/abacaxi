import React from 'react';
import VideoReactionButtons from './VideoReactionButtons.jsx';
import { thumbnail_url, video_url, truncate_str } from '../utils.jsx';

export default class VideoCard extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
    }
    render(){
        return(
            <div className="card" style={{ width: "18rem", float: "left", marginRight: "8px" }}>
                <a href={video_url(this.props.video.ytId)}><img className="card-img-top" src={thumbnail_url(this.props.video.ytId)} alt="Card image cap"></img></a>
                <div className="card-body">
                    <h5 className="card-title">{truncate_str(this.props.video.title, 38)}</h5>
                    <VideoReactionButtons upvotes={this.props.video.upvotes} downvotes={this.props.video.downvotes} videoInfo={this.props.video}/>
                </div>
            </div>
        );
    }
}