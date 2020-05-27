import React from "react";
import {Menu} from "semantic-ui-react";
import Channels from "./Channels";
const SidePanel = ({currentUser}) => {
    return (
        <Menu size="large" inverted fixed="left" vertical style={{background: "#4c3c4c", fontSize: "1.2rem"}}>
                       <Channels currentUser={currentUser}/>
        </Menu>
    )
}

export default SidePanel
