import { PassThrough } from "stream";

class VideoReactionButtons extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        upvotes: props.upvotes,
        downvotes: props.downvotes,
        click: 0,
        upvoteButtonActive: false,
        downvoteButtonActive: false,
        videoInfo: {
            wikiID: props.wikiID,
            sectionIdx: props.sectionIdx,
            ytID: props.ytID,
        }
      }
      this.handleDownvote = this.handleDownvote.bind(this);
      this.handleUpvote = this.handleUpvote.bind(this);
    }

    handleDownvote(e){
        e.preventDefault();
        let request = {
            "video":{
                "wikiPageId": this.state.videoInfo.wikiID,
                "sectionIdx": this.state.videoInfo.sectionIdx,
                "ytId": this.state.videoInfo.ytID,
                "downvote": this.state.click >= 0,
            }
        }
        if (this.state.click == 1){
            request.upvote = false
        }
        this.setState(prevState => ({
            downvoteButtonActive: !prevState.downvoteButtonActive,
            click: (prevState.click >= 0) ? -1 : 0,
            downvotes: (prevState.click >= 0) ? prevState.downvotes++ : prevState.downvotes--,
            upvotes: (prevState.click == 1) ? prevState.upvotes-- : prevState.upvotes
        })); 
        fetch('/api/videos', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        })
    }
    handleUpvote(e){
        e.preventDefault();
        let request = {
            "video":{
                "wikiPageId": this.state.videoInfo.wikiID,
                "sectionIdx": this.state.videoInfo.sectionIdx,
                "ytId": this.state.videoInfo.ytID,
                "upvote": this.state.click >= 0
            }
        }
        if (this.state.click == -1){
            request.downvote = false
        }
        this.setState(prevState => ({
            upvoteButtonActive: !prevState.upvoteButtonActive,
            click: (prevState.click <= 0) ? 1 : 0,
            upvotes: (prevState.click <= 0) ? prevState.upvotes++ : prevState.upvotes--,
            downvotes: (prevState.click == -1) ? prevState.downvotes-- : prevState.downvotes
        })); 
        fetch('/api/videos', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        })
    }
    render(){
        

      
    }
}  