import React, { Component } from 'react'
import { Form, Icon, Input, Button, Row, Col} from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import moment from 'moment';
import { getChats, afterPostMessage } from "../../../_actions/chat_actions";
import ChatCard from './Sections/ChatCard';


export class ChatPage extends Component {
    state = {
        chatMessage: "",
    }
    // Retrieve chats on mount
    componentDidMount() {
        let server = "http://localhost:5000";
        this.props.dispatch(getChats());

        this.socket = io(server);

        this.socket.on("Output Chat Message", messageFromBackend => {
            this.props.dispatch(afterPostMessage(messageFromBackend));
            
            //console.log("messageFromBackend", messageFromBackend);
        })
    }
    // Scroll down as component updates
    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }
    // Sets state for chat message
    handleSearchChange = (e) => {
        this.setState({
            chatMessage: e.target.value
        })
    }
    // Render chat messages in form of individual message boxes
    renderCards = () => 
        this.props.chats.chats
        && this.props.chats.chats.map((chat) => (
            <ChatCard key={chat._id} {...chat} />
        ));
    
    submitChatMessage = (e) => {
        e.preventDefault();

        //To allow only authenticated user to send message
        if (this.props.user.userData && !this.props.user.userData.isAuth) {
            return alert('Please Log in first');
        }
        
        let chatMessage = this.state.chatMessage;
        let userId = this.props.user.userData._id;
        let userName = this.props.user.userData.name;
        let userImage = this.props.user.userData.image;
        let nowTime = moment();
        let type = "Text";

        this.socket.emit("Input Chat Message", {
            chatMessage,
            userId,
            userName,
            userImage,
            nowTime,
            type
        });
        this.setState({ chatMessage: ""})
    }
    
    render() {
        return (
            <React.Fragment>
                 <div>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}> Real Time Chat</p>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="infinite-container" style={{ maxHeight: '500px', overflowY: 'scroll' }}>
                        {/* Render messages only if available */}
                        {this.props.chats && (
                             this.renderCards()
                        )}
                        <div
                            ref={el => {
                                this.messagesEnd = el;
                            }}
                            style={{ float: "left", clear: "both" }}
                        />
                    </div>

                    <Row>
                        <Form layout="inline" onSubmit={ this.submitChatMessage}>
                            <Col span={ 18 }>
                                <Input id="message"
                                    prefix={ <Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} /> }
                                    placeholder="Let's start talking"
                                    type="text"
                                    value={ this.state.chatMessage }
                                    onChange={ this.handleSearchChange }
                                />
                            </Col>
                            <Col span={ 2 }>

                            </Col>

                            <Col span={ 4 }>
                                <Button type="primary" style={{ width: '100%' }} onClick={ this.submitChatMessage } htmlType="submit">
                                <CheckCircleTwoTone twoToneColor="#1F618D" /> Send
                                </Button>
                            </Col>
                        </Form>
                    </Row>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return{
        user: state.user,
        chats: state.chat
    }
}

export default connect(mapStateToProps)(ChatPage);
