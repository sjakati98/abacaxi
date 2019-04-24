import React from 'react';

export default class VideoReactionButtons extends React.Component { 
    constructor(props){
        super(props);

        this.state = {
            upvotes: props.upvotes,
            downvotes: props.downvotes,
            click: false,
            upvoteButtonActive: false,
            downvoteButtonActive: false,
            videoInfo: props.videoInfo
        }

        this.handleDownvote = this.handleDownvote.bind(this);
        this.handleUpvote = this.handleUpvote.bind(this);

    }

    handleUpvote(e){
        //handle SyntheticEvent
        e.preventDefault();
        let updateRequest = {
        "video": {
            "wikiPageId": this.state.videoInfo.wikiPageId,
            "sectionIdx": this.state.videoInfo.sectionIdx,
            "ytId": this.state.videoInfo.ytId,
            "upvote": true
        }
        }
        if (!this.state.click){
        fetch('/api/videos', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateRequest),
        })
        .then(res => res.json())
        .then(json => {
            if (json.success){
            this.setState(prevState => ({
                click: true,
                upvoteButtonActive: true,
                upvotes: prevState.upvotes + 1
            }));
            }
            else{
            alert(json.msg)
            }
        })
        }
    }

    handleDownvote(e){
         // handle SyntheticEvent
        e.preventDefault();

        let updateRequest = {
            "video": {
                "wikiPageId": this.state.videoInfo.wikiPageId,
                "sectionIdx": this.state.videoInfo.sectionIdx,
                "ytId": this.state.videoInfo.ytId,
                "downvote": true
            }
        }
        if (!this.state.click){
            fetch('/api/videos', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateRequest),
            })
            .then(res => res.json())
            .then(json => {
                if (json.success){
                this.setState(prevState => ({
                    click: true,
                    downvoteButtonActive: true,
                    downvotes: prevState.downvotes + 1
                }));
                }
            })
        }
    }

    render(){

        let upvoteButtonColor = (this.state.upvoteButtonActive) ? "btn btn-success" : "btn btn-light"
        let downvoteButtonColor = (this.state.downvoteButtonActive) ? "btn btn-danger" : "btn btn-light"

        return(
            <div className="row">
                <button  className={upvoteButtonColor} onClick={this.handleUpvote}>Upvote {this.state.upvotes}</button>
                <button className={downvoteButtonColor} onClick={this.handleDownvote}>Downvote {this.state.downvotes}</button>
            </div>
        )
    }
}