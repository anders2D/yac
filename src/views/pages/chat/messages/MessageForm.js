import React, {Component} from "react";
import {firebaseStorage, firebaseDb} from "core/firebase";
import {Segment, Button, Input} from "semantic-ui-react";


class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storageRef: firebaseStorage.ref(),
            typingRef: firebaseDb.ref("typing"),
            uploadTask: null,
            uploadState: "",
            percentUploaded: 0,
            message: "",
            channel: this.props.currentChannel,
            user: this.props.currentUser,
            loading: false,
            errors: [],
            modal: false
        };
    }


    componentWillUnmount() {
        if (this.state.uploadTask !== null) {
            this.state.uploadTask.cancel();
            this.setState({uploadTask: null});
        }
    }

    openModal = () => this.setState({modal: true});

    closeModal = () => this.setState({modal: false});

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    // handleKeyDown = event => {
    //     if (event.ctrlKey && event.keyCode === 13) {
    //         this.sendMessage();
    //     }

    //     const {message, typingRef, channel, user} = this.state;

    //     // if (message) {
    //     //     typingRef
    //     //         .child(channel.id)
    //     //         .child(user.uid)
    //     //         .set(useopenModalr.displayName);
    //     // } else {
    //     //     typingRef
    //     //         .child(channel.id)
    //     //         .child(user.uid)
    //     //         .remove();
    //     // }
    // };


    colonToUnicode = message => {
        return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
            x = x.replace(/:/g, "");
            let emoji = emojiIndex.emojis[x];
            if (typeof emoji !== "undefined") {
                let unicode = emoji.native;
                if (typeof unicode !== "undefined") {
                    return unicode;
                }
            }
            x = ":" + x + ":";
            return x;
        });
    };

    createMessage = (fileUrl = null) => {
        console.log("views/pages/chat/messages/createMessage")
        console.log(this)
        console.log(firebaseDb)
        const message = {
            // timestamp: firebaseDb.ServerValue.TIMESTAMP,
            timestamp: Date.now(),
            user: {
                id: this.state.user.id,
                name: this.state.user.displayName,
            }
        };

        message["content"] = this.state.message;
        
        return message;
    };

    sendMessage = () => {
        const {getMessagesRef} = this.props;
        const {message, channel, user, typingRef} = this.state;
        console.log(this)
        if (message) {
            this.setState({loading: true});
            getMessagesRef()
                .child("-M8ELutRdzqiBjGNCvEE")
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({loading: false, message: "", errors: []});
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    });
                });
        } else {
            this.setState({
                errors: this.state.errors.concat({message: "Add a message"})
            });
        }
    };





    render() {
        // prettier-ignore
        const {errors, message, loading, modal, uploadState, percentUploaded} = this.state;

        return (
            <Segment className="message__form">

                <input
                    fluid
                    name="message"
                    onChange={this.handleChange}
                    // onKeyDown={this.handleKeyDown}
                    value={message}
                    ref={node => (this.messageInputRef = node)}
                    style={{marginBottom: "0.7em"}}

                    labelPosition="left"
                    className={
                        errors.some(error => error.message.includes("message"))
                            ? "error"
                            : ""
                    }
                    placeholder="Write your message"
                />
                <Button.Group icon widths="2">
                    <Button
                        onClick={this.sendMessage}
                        disabled={loading}
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                    />
                </Button.Group>

            </Segment>
        );
    }
}

export default MessageForm;
