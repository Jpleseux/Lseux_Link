import React, { useState, useEffect, useContext, useRef } from "react";
import { io, Socket } from "socket.io-client";
import "../../../public/style/chats/chats.css";
import { ChatEntity } from "../../entities/chats/chatEntity.entity";
import { GatewayContext } from "../../gateway/gatewayContext";
import { MessageEntity } from "../../entities/chats/messageEntity.entity";
import { UserEntity } from "../../entities/chats/user.entity";
import ConfirmationDialog from "../../components/confirmDialog/confirmDialog";
import Message from "../../components/visual/Message.component";
import { Link } from "react-router-dom";

const SOCKET_SERVER_URL = 'http://localhost:4000';

function IndexGroups() {
    const [groups, setGroups] = useState<ChatEntity[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<ChatEntity | null>(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [uuid, setUuid] = useState("");
    const [msg, setMsg] = useState({ msg: null, status: null });
    const messagesEndRef = useRef(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const groupsGateway = useContext(GatewayContext)?.chatsGateway;
    const messagesGateway = useContext(GatewayContext)?.messagesGateway;
    const profileGateway = useContext(GatewayContext)?.profileGateway;
    const [initialLoad, setInitialLoad] = useState(true);

    const scrollToBottom = (shouldScroll = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: shouldScroll ? "smooth" : "instant" });
    };

    async function handleGroupClick(group: ChatEntity) {
        setNewMessage("");
        setSelectedGroup(() => group);
        setInitialLoad(true);
        scrollToBottom(false);
    }

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (message) => {
            setGroups(prevGroups => {
                const updatedGroups = prevGroups.map(group => {
                    if (group.uuid() === message.props.chatUuid) {
                        return new ChatEntity({
                            ...group.props,
                            messages: [...(group.messages() || []), new MessageEntity({
                                chatUuid: message.props.chatUuid,
                                sender: new UserEntity(message.props.sender.props),
                                text: message.props.text,
                                uuid: message.props.uuid,
                            })]
                        });
                    }
                    return group;
                });

                return updatedGroups;
            });

            setSelectedGroup(prevSelectedGroup => {
                if (prevSelectedGroup && prevSelectedGroup.uuid() === message.props.chatUuid) {
                    return new ChatEntity({
                        ...prevSelectedGroup.props,
                        messages: [...(prevSelectedGroup.messages() || []), new MessageEntity({
                            chatUuid: message.props.chatUuid,
                            sender: new UserEntity(message.props.sender.props),
                            text: message.props.text,
                            uuid: message.props.uuid,
                        })]
                    });
                }
                return prevSelectedGroup;
            });

            setInitialLoad(false);
            scrollToBottom();
        };

        const handleDeleteMessage = (messageUuid: string) => {
            setGroups(prevGroups => {
                const updatedGroups = prevGroups.map(group => {
                    if (group.messages().some(msg => msg.uuid() === messageUuid)) {
                        return new ChatEntity({
                            ...group.props,
                            messages: group.messages().filter(msg => msg.uuid() !== messageUuid)
                        });
                    }
                    return group;
                });

                return updatedGroups;
            });

            setSelectedGroup(prevSelectedGroup => {
                if (prevSelectedGroup && prevSelectedGroup.messages().some(msg => msg.uuid() === messageUuid)) {
                    return new ChatEntity({
                        ...prevSelectedGroup.props,
                        messages: prevSelectedGroup.messages().filter(msg => msg.uuid() !== messageUuid)
                    });
                }
                return prevSelectedGroup;
            });
        };

        socket.on('delete-message', handleDeleteMessage);
        socket.on('send-message', handleMessage);

        return () => {
            if (socket) {
                socket.off('delete-message', handleDeleteMessage);
                socket.off('send-message', handleMessage);
            }
        };
    }, [socket, selectedGroup]);

    useEffect(() => {
        getGroups();
        const newSocket: Socket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    async function getGroups() {
        const res = await profileGateway?.findUserByEmail();
        setUuid(res?.user?.uuid() as string);
        const response = await groupsGateway?.findChatsByUser();
        setGroups(response?.chats as ChatEntity[]);
    }

    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(event.target.value);
        scrollToBottom();
    };

    const sendMessage = async () => {
        setMsg({ msg: null, status: null });
        if (selectedGroup) {
            const response = await messagesGateway?.sendMessage(newMessage, selectedGroup.uuid());
            setMsg({ msg: response?.message, status: response?.status });
        }
        setNewMessage("");
        scrollToBottom();
    };

    const handleKeyDown = (e) => {
        if (newMessage.length > 0 && e.key === "Enter") {
            sendMessage();
        }
    };

    const confirmDeleteMessage = async () => {
        if (messageToDelete) {
            await messagesGateway?.deleteMessage(messageToDelete);
            setIsDialogVisible(false);
            setMessageToDelete(null);
        }
    };

    const cancelDeleteMessage = () => {
        setIsDialogVisible(false);
        setMessageToDelete(null);
    };
    useEffect(() => {
        if (selectedGroup) {
            scrollToBottom(initialLoad ? false : true);
            setInitialLoad(false);
        }
    }, [selectedGroup, selectedGroup?.messages()]);

    const filteredGroups = groups.filter(group =>
        group.name().toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {msg.msg && <Message msg={msg.msg} status={msg.status} timers={3000} />}
            {isDialogVisible && (
                <ConfirmationDialog
                    message="Você tem certeza que quer deletar esta mensagem?"
                    onConfirm={confirmDeleteMessage}
                    onCancel={cancelDeleteMessage}
                />
            )}
            <div className="container chats-container">
                <div className="content-wrapper">
                    <div className="row gutters">
                        <div className="col-12">
                            <div className="card m-0">
                                <div className="row no-gutters">
                                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                        <div className="users-container-contacts">
                                            <div className="chat-search-box">
                                                <div className="d-flex flex-wrap justify-content-center mb-4 m-2">
                                                    <Link to={`/home/chats/add`} className="me-2 mb-2 mb-md-0">
                                                        <button type="button" className="btn btn-info add-btn d-flex align-items-center justify-content-center">
                                                            <span className="add-text">Adicionar Grupo</span>
                                                        </button>
                                                    </Link>
                                                </div>
                                                <div className="input-group">
                                                    <input
                                                        className="form-control"
                                                        placeholder="Procurar"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        value={search}
                                                    />
                                                    <div className="input-group-btn">
                                                        <button type="button" className="btn btn-info">
                                                            <i className="fa fa-search">Procurar</i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="users">
                                                {!loading && filteredGroups.length > 0 && filteredGroups.map((group, index) => (
                                                    <li
                                                        className={`person ${selectedGroup === group ? 'active' : ''}`}
                                                        data-chat="person1"
                                                        key={index}
                                                        onClick={() => handleGroupClick(group)}
                                                    >
                                                        <div className="user">
                                                            <span className="status online"></span>
                                                        </div>
                                                        <p className="name-time">
                                                            <span className="name">{group.name()}</span>
                                                        </p>
                                                    </li>
                                                ))}
                                                {!loading && filteredGroups.length === 0 && (
                                                    <li className="no-contacts">Nenhum grupo encontrado</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
                                        {selectedGroup ? (
                                            <>
                                                <div className="selected-user">
                                                    <span>Para: <span className="name">{selectedGroup.name()}</span></span>
                                                    {selectedGroup.users()[0].uuid() === uuid ? <button className="cancel-button" type="button">Sair</button> : <button className="cancel-button" type="button">Deletar Grupo</button>}
                                                </div>
                                                <div className="chat-container">
                                                    <ul className="chat-box chatContainerScroll">
                                                        {selectedGroup.messages().map((message, index) => (
                                                            <li key={index} className={message.sendByMe(uuid) ? "chat-right m-4" : "chat-left m-4"}>
                                                                {message.sendByMe(uuid) ?
                                                                    <>
                                                                        <div className="chat-text">{message.text()}</div>
                                                                        <div className="chat-avatar">
                                                                            <img src={message.sender().avatar()} alt="Retail Admin" className="m-2" />
                                                                            <div className="chat-name">{message.sender().userName()}</div>
                                                                            {message.sender().uuid() === uuid && (
                                                                                <span className="delete-message" onClick={() => {
                                                                                    setIsDialogVisible(true);
                                                                                    setMessageToDelete(message.uuid());
                                                                                }}>Apagar</span>
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <div className="chat-avatar">
                                                                            <img src={message.sender().avatar()} alt="Retail Admin" />
                                                                            <div className="chat-name">{message.sender().userName()}</div>
                                                                            {message.sender().uuid() === uuid && (
                                                                                <span className="delete-message" onClick={() => {
                                                                                    setIsDialogVisible(true);
                                                                                    setMessageToDelete(message.uuid());
                                                                                }}>Apagar</span>
                                                                            )}
                                                                        </div>
                                                                        <div className="chat-text">{message.text()}</div>
                                                                    </>
                                                                }
                                                            </li>
                                                        ))}
                                                        <div ref={messagesEndRef} />
                                                    </ul>
                                                    <div className="form-group mt-3 mb-0">
                                                        <textarea
                                                            className="form-control"
                                                            rows={3}
                                                            placeholder="Digite sua mensagem aqui..."
                                                            value={newMessage || ''}
                                                            onKeyDown={handleKeyDown}
                                                            onChange={handleMessageChange}
                                                        ></textarea>
                                                        {newMessage.length > 0 &&
                                                            <button type="button" className="btn btn-info mt-2" onClick={sendMessage}>Enviar</button>
                                                        }
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="no-chat-selected">Nenhum grupo selecionado</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default IndexGroups;
