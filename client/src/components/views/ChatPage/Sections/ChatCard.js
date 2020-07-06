import React from "react";
import moment from 'moment';
import ReactEmoji from 'react-emoji';
import { Comment, Tooltip, Avatar } from 'antd';

// Functional based component for each message box in chat with name, time, message and Image
function ChatCard(props) {
    return (
        <div style={{ width: '100%' }}>
            <Comment
                author={props.sender.name}
                avatar={
                    <Avatar
                        src={props.sender.image} alt={props.sender.name}
                    />
                }
                content={
                        <p>
                            {ReactEmoji.emojify(props.message)}
                        </p>
                }
                datetime={
                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment().fromNow()}</span>
                    </Tooltip>
                }
            />
        </div>
    )
}

export default ChatCard;