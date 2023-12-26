import { useContext, useEffect, useState } from "react";
import { CurrentUserContext, ErrorContext } from "../../App";
import SockJsClient from "react-stomp";
import PlayerService from "../../api/player-service";
import "./chat.css";

var socket = null;

function Chat() {

    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorContext);
    
    const [topics, setTopics] = useState(["/chat/public"]);
    const [publicChats, setPublicChats] = useState([]);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [principal, setPrincipal] = useState(null);
    const [connected, setConnected] = useState(false);
    const [tab, setTab] = useState("public");
    const [messageInput, setMessageInput] = useState("");
 

    function sendMessage() {
        if (socket) {
            let chatMessage = {
                receiver: tab,
                content: messageInput,
                type: "CHAT"
            };
            let channel = tab === "public" ? "/message" : "/private-message"
            socket.sendMessage("/app" + channel, JSON.stringify(chatMessage));
            setMessageInput("");
        }
    }

    function handleMessageInputChange(event) {
        setMessageInput(event.target.value);
    }

    function handleMessage(message) {
        console.log(message);   
        switch(message.type) {
            case "CHAT":
                if (message.receiver === "all") {
                    setPublicChats([...publicChats, message]);
                } else {
                    if (privateChats[message.sender] === undefined) {
                        privateChats[message.sender] = [];
                    }
                    privateChats[message.sender].push(message);
                    setPrivateChats({...privateChats});
                }
                break;
            case "PLAYERS":
                for (let i in message.content) {
                    if (message.content[i] === "ONLINE") {
                        if (privateChats[i] === undefined) {
                            privateChats[i] = [];
                        }
                    } else if (message.content[i] === "OFFLINE") {
                        privateChats[i] = undefined;
                    }
                }
                setPrivateChats({...privateChats});
                break;
            default:
                break;
        }     
    }

    function handleConnected() {
        setConnected(true);
        PlayerService.getPrincipalById(
            currentUser.id
        )
        .then(data => {
            setPrincipal(data.principal);
        }
        ).catch(error => {
            handleError(error);
        });
    }

    useEffect(() => {
        if (principal) {
            let newTopics = ["/chat/public"];
            setTopics([...newTopics, "/player/" + principal + "/private"]);
        }
    }, [principal]);

    return (
        <div className="chat">
            {currentUser?.username}
            {connected ? 
                <div className="chat-inner">
                    <div className="players">
                        <button className={"chat-button " + (tab === "public" ? "selected" : "")} onClick={() => {setTab("public")}}>Public</button>
                        {[...Object.keys(privateChats)].map((name) => (
                            <div key={name}><button className={"chat-button " + (tab === name ? "selected" : "")} onClick={() => {setTab(name)}}>{name}</button></div>
                        ))}
                    </div>
                    <div className="input-and-message-box">
                        <div className="message-box">
                            {tab === "public" ?
                                <div> 
                                    {publicChats.map((message, index) => (
                                        <div key={index}>{message.sender}: {message.content}</div>
                                    ))}  
                                </div>
                                :
                                <div>
                                    {privateChats[tab].map((message, index) => (
                                        <div key={index}>{message.sender}: {message.content}</div>
                                    ))}
                                </div>}
                        </div>
                        <br/>
                        <div className="chat-input">
                            <input className="username-input" value={messageInput} onChange={handleMessageInputChange}></input>
                            <button className="register-button" onClick={sendMessage} disabled={!messageInput}>Send</button>
                        </div>
                    </div>
                </div> 
                : 
                <div>
                    <br/>
                    <a href="/register">Register</a>
                    <br/>
                    <a href="/login">Login</a>
                </div>}
                {currentUser && <SockJsClient url={process.env.REACT_APP_API_URL + "/ws?token=" + currentUser.token}
					topics={topics}
					onMessage={(message) => {
                        handleMessage(message);
					}}
					onConnect={() => {
                        handleConnected();
					}}
					onDisconnect={() => {
                        setPrincipal(null);
						console.log("Disconnected");
					}}
					ref={(client) => {
						socket = client;
					}} />}
                    <div className="form">
                <a href="/">Home</a>&nbsp;
                <a href="/dashboard">Dashboard</a>&nbsp;
                <a href="/players">Players</a>&nbsp;
                <a href="/games">Games</a>&nbsp;
                <a href="/scores">Scores</a>
            </div>
        </div>
    )
}

export default Chat;