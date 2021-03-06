import React, {Component, Fragment} from "react";
import {firebaseStorage, firebaseAuth, firebaseDb} from "core/firebase";
import {connect} from "react-redux";
import {setCurrentChannel, setPrivateChannel} from "core/chat/actions";
import {Menu, Icon, Modal, Form, Input, Button, Label} from "semantic-ui-react";


class Channels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeChannel: "",
            user: this.props.currentUser,
            channel: null,
            channels: [],
            channelName: "",
            channelDetails: "",
            channelsRef: firebaseDb.ref("channels"),
            messagesRef: firebaseDb.ref("messages"),
            notifications: [],
            modal: false,
            firstLoad: true
        };
    }

    componentDidMount() {
        this.addListeners();
    }

    UNSAFE_componentWillMount() {
        this.removeListeners();
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on("child_added", snap => {
            loadedChannels.push(snap.val());
            this.setState({channels: loadedChannels}, () => this.setFirstChannel());
            this.addNotifications(snap.key)
        });
    };

    addNotifications = snapKey => {
        this.state.messagesRef.child(snapKey).on('value', snap => {
            if (this.state.channel) {
                this.onHandleNotification(snapKey, "-M8ELutRdzqiBjGNCvEE", this.state.notifications, snap)
            }
        })
    }

    onHandleNotification = (snapKey, currentChannelId, notifications, snap) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notification => notification.id === snapKey);
        if (index !== -1) {
            if (snapKey !== currentChannelId) {
                lastTotal = notifications[index].total;
                if (snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: snapKey,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            })
        }
        this.setState({
            notifications
        })
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        // if (this.state.firstLoad && this.state.channels.length > 0) {
            setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
            this.setState({
                channel: firstChannel
            })
        // }
        this.setState({firstLoad: false});
    };

    addChannel = () => {
        const {channelsRef, channelName, channelDetails, user} = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({channelName: "", channelDetails: ""});
                this.closeModal();
                console.log("channel added");
            })
            .catch(err => {
                console.error(err);
            });
    };

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.addChannel();
        }
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.clearNotifications();
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({
            channel
        })
    };

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id = "-M8ELutRdzqiBjGNCvEE");
        if (index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            this.setState({
                notifications: updatedNotifications
            })
        }
    }

    setActiveChannel = channel => {
        this.setState({activeChannel: "-M8ELutRdzqiBjGNCvEE"});
    };
    // hiển thị list channels ra màn hình
    displayChannels = channels =>
        channels.length > 0 &&
        channels.map(channel => (
            <Menu.Item
                key={"-M8ELutRdzqiBjGNCvEE"}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{opacity: 0.7}}
                active={"-M8ELutRdzqiBjGNCvEE" === this.state.activeChannel}
            >
                {this.getNotificationCount(channel) && (
                    <Label color="red">
                        {this.getNotificationCount(channel)}
                    </Label>
                )}
                # {channel.name}
            </Menu.Item>
        ));

    isFormValid = ({channelName, channelDetails}) =>
        channelName && channelDetails;

    openModal = () => this.setState({modal: true});
    getNotificationCount = channel => {
        let count = 0;
        this.state.notifications.forEach(notification=> {
            if(notification.id==="-M8ELutRdzqiBjGNCvEE") {
                count = notification.count;
            }
        });
        if(count> 0 ) return count;
    }
    closeModal = () => this.setState({modal: false});

    render() {
        const {channels, modal} = this.state;

        return (
            <Fragment>
                <Menu.Menu className="menu">
                    <Menu.Item>
            <span>
              <Icon name="exchange"/> CHANNELS
            </span>{" "}
                        ({channels.length}) <Icon name="add" onClick={this.openModal}/>
                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>

                {/* Add Channel Modal */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <Input
                                    fluid
                                    label="About the Channel"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark"/> Add
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove"/> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Fragment>
        );
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setCurrentChannel: channel => {
            dispatch(setCurrentChannel(channel))
        },
        setPrivateChannel: isPrivateChannel => {
            dispatch(setPrivateChannel(isPrivateChannel))
        }
    }
}

export default connect(null, mapDispatchToProps)(Channels);
