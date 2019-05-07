import React from 'react';

export default class InfoModal extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="modal fade" id="howItWorksModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">How Abacaxi Works</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <ul id='howItWorksList'>
                                <li>Abacaxi works by taking your entered search term and attempting to match it to a content page stored in the database.</li>
                    
                                <li>Each content page is constructed from an existing Wiki Page's structure and populated with videos from the internet that Abacaxi's community feels best explains or describes the main topic and its subsequent subtopics or child topics.</li>
                    
                                <li>Users of Abacaxi can similarly submit their own suggestions and vote on such videos to provide their own input.</li>
                            </ul>
                        </div>
                    </div>
                </div>
          </div>
        );
    }
}