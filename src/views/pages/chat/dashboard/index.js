import React from "react";
import {Grid} from "semantic-ui-react";
import {connect} from "react-redux";
import Messages from "../messages/Messages";
// import MetaPanel from "../MetaPanel/MetaPanel";

// prettier-ignore
const Dashboard = ({currentUser, currentChannel, isPrivateChannel, userPosts, primaryColor, secondaryColor}) => {
    return (
        <Grid columns="equal" className="app" style={{background: secondaryColor}}>


            <Grid.Column style={{marginLeft: 320}}>
                <Messages
                    key={currentChannel && currentChannel.id}
                    currentChannel={currentChannel}
                    currentUser={currentUser}
                    isPrivateChannel={isPrivateChannel}
                />
            </Grid.Column>

        </Grid>
    )
}

const mapStateToProps = state => {
    console.log("views/pages/chat/dashboard/")
    console.log(state)
    return {
        currentUser: state.auth,
        currentChannel: state.chat.currentChannel,
        isPrivateChannel: state.chat.isPrivateChannel,
        userPosts: state.chat.userPosts,
        primaryColor: 1,
        secondaryColor: 1
    }
}

export default connect(mapStateToProps, null)(Dashboard);

