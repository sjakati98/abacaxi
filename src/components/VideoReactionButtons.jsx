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

        // declare the PUT request according to the API specification
        let updateRequest = {
            "video": {
                "wikiPageId": this.state.videoInfo.wikiPageId,
                "sectionIdx": this.state.videoInfo.sectionIdx,
                "ytId": this.state.videoInfo.ytId,
                "upvote": true
            }
        }

        // make sure no action has been taken previously
        if (!this.state.click){
            // make the PUT request
            fetch('/api/videos', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateRequest),
            })
            .then(res => res.json())
            .then(json => {
                if (json.success){
                //update state if the request was successful
                this.setState(prevState => ({
                    click: true,
                    upvoteButtonActive: true,
                    upvotes: prevState.upvotes + 1
                }));
                }
                // if the request was not successful then alert the error message
                else{
                alert(json.msg)
                }
            })
        }
    }

    handleDownvote(e){
         // handle SyntheticEvent
        e.preventDefault();
        // declare the PUT request according to the API specification
        let updateRequest = {
            "video": {
                "wikiPageId": this.state.videoInfo.wikiPageId,
                "sectionIdx": this.state.videoInfo.sectionIdx,
                "ytId": this.state.videoInfo.ytId,
                "downvote": true
            }
        }
        // make sure no action has been taken previously
        if (!this.state.click){
            // make the request
            fetch('/api/videos', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateRequest),
            })
            .then(res => res.json())
            .then(json => {
                if (json.success){
                    // update the state if the request was successful
                    this.setState(prevState => ({
                        click: true,
                        downvoteButtonActive: true,
                        downvotes: prevState.downvotes + 1
                    }));
                }
                else{
                    alert(json.msg);
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