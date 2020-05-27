import React, {Component} from "react";
import {Segment, Comment} from "semantic-ui-react";
import {connect} from "react-redux";
import {setUserPosts} from "core/chat/actions";
import {firebaseAuth, firebaseDb,firebaseStorage} from "core/firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import Typing from "./Typing";
import Skeleton from "./Skeleton";

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            privateChannel: this.props.isPrivateChannel,
            privateMessagesRef: firebaseDb.ref("privateMessages"),
            messagesRef: firebaseDb.ref("messages"),
            messages: [],
            messagesLoading: true,
            channel: {id:"-M8ELutRdzqiBjGNCvEE", details:"",name:"none"},
            isChannelStarred: false,
            user: this.props.currentUser,
            usersRef: firebaseDb.ref("users"),
            numUniqueUsers: "",
            searchTerm: "",
            searchLoading: false,
            searchResults: [],
            typingRef: firebaseDb.ref("typing"),
            typingUsers: [],
            connectedRef: firebaseDb.ref(".info/connected"),
            listeners: []
        };
    }


    componentDidMount() {
        const {channel, user, listeners} = this.state;
        console.log("views/pages/chat/messages actions")
        console.log(this)
        console.log(firebaseDb)
        if ( user) {
            this.removeListeners(listeners);
            this.addListeners(channel.id);
            this.addUserStarsListener(channel.id, user.id);
        }
    }

    componentWillUnmount() {
        this.removeListeners(this.state.listeners);
        this.state.connectedRef.off();
    }

    removeListeners = listeners => {
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event);
        });
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.messagesEnd) {
            this.scrollToBottom();
        }
    }

    addToListeners = (id, ref, event) => {
        const index = this.state.listeners.findIndex(listener => {
            return (
                listener.id === id && listener.ref === ref && listener.event === event
            );
        });

        if (index === -1) {
            const newListener = {id, ref, event};
            this.setState({listeners: this.state.listeners.concat(newListener)});
        }
    };

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    };

    addListeners = channelId => {
        this.addMessageListener(channelId);
        this.addTypingListeners(channelId);
    };

    addTypingListeners = channelId => {
        let typingUsers = [];
        this.state.typingRef.child(channelId).on("child_added", snap => {
            if (snap.key !== this.state.user.id) {
                typingUsers = typingUsers.concat({
                    id: snap.key,
                    name: snap.val()
                });
                this.setState({typingUsers});
            }
        });
        this.addToListeners(channelId, this.state.typingRef, "child_added");

        this.state.typingRef.child(channelId).on("child_removed", snap => {
            const index = typingUsers.findIndex(user => user.id === snap.key);
            if (index !== -1) {
                typingUsers = typingUsers.filter(user => user.id !== snap.key);
                this.setState({typingUsers});
            }
        });
        this.addToListeners(channelId, this.state.typingRef, "child_removed");

        this.state.connectedRef.on("value", snap => {
            if (snap.val() === true) {
                this.state.typingRef
                    .child(channelId)
                    .child(this.state.user.id)
                    .onDisconnect()
                    .remove(err => {
                        if (err !== null) {
                            console.error(err);
                        }
                    });
            }
        });
    };

    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();

        console.log("views/pages/chat/messages/ addMessageListener")
        console.log(this)
        ref.child(channelId).on("child_added", snap => {
            loadedMessages.push(snap.val());
                
                const url = "https://www.googleapis.com/youtube/v3/search?part=id&q=tuto&type=video&key=AIzaSyA9sIsDfoE8ltqjgrEiXvz7JO6Vj6AvzxU";
                // const response = await fetch(url);
                // const data = await response.json();
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqueUsers(loadedMessages);
            this.countUserPosts(loadedMessages);
            console.log(loadedMessages)
        });
        this.addToListeners(channelId, ref, "child_added");
    };

    addUserStarsListener = (channelId, userId) => {
        this.state.usersRef
            .child(userId)
            .child("starred")
            .once("value")
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({isChannelStarred: prevStarred});
                }
            });
    };

    getMessagesRef = () => {
        const {messagesRef, privateMessagesRef, privateChannel} = this.state;
        return privateChannel ? privateMessagesRef : messagesRef;
    };

    handleStar = () => {
        this.setState(
            prevState => ({
                isChannelStarred: !prevState.isChannelStarred
            }),
            () => this.starChannel()
        );
    };

    starChannel = () => {
        if (this.state.isChannelStarred) {
            this.state.usersRef.child(`${this.state.user.id}/starred`).update({
                [this.state.channel.id]: {
                    name: this.state.channel.name,
                    details: this.state.channel.details,
                    createdBy: {
                        name: this.state.channel.createdBy.name,
                        avatar: this.state.channel.createdBy.avatar
                    }
                }
            });
        } else {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .child(this.state.channel.id)
                .remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                });
        }
    };



    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
        const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
        this.setState({numUniqueUsers});
    };

    countUserPosts = messages => {
        let userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                };
            }
            return acc;
        }, {});
        this.props.setUserPosts(userPosts);
    };

    displayMessages = messages =>
        messages.length > 0 &&
        messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ));

    displayChannelName = channel => {
        return channel
            ? `${this.state.privateChannel ? "@" : "#"}${channel.name}`
            : "";
    };

    displayTypingUsers = users =>
        users.length > 0 &&
        users.map(user => (
            <div
                style={{display: "flex", alignItems: "center", marginBottom: "0.2em"}}
                key={user.id}
            >
                <span className="user__typing">{user.name} is typing</span> <Typing/>
            </div>
        ));

    displayMessageSkeleton = loading =>
        loading ? (
            <React.Fragment>
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i}/>
                ))}
            </React.Fragment>
        ) : null;

    render() {
        // prettier-ignore
        const {messagesRef, messages, channel, user, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel, isChannelStarred, typingUsers, messagesLoading} = this.state;

        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    // handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred}
                />

                <Segment>
                    <Comment.Group className="messages">
                        {this.displayMessageSkeleton(messagesLoading)}
                        {searchTerm
                            ? this.displayMessages(searchResults)
                            : this.displayMessages(messages)}
                        {this.displayTypingUsers(typingUsers)}
                        <div ref={node => (this.messagesEnd = node)}/>
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                />
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setUserPosts: userPosts => {
            dispatch(setUserPosts(userPosts))
        }
    }
}
export default connect(null, mapDispatchToProps)(Messages);
