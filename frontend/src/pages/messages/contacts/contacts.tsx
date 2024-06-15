import React, { useContext, useEffect, useState, useRef } from "react";
import { IoMdPersonAdd } from "react-icons/io";
import "../../../../public/style/chats/contacts.css";
import { Link } from "react-router-dom";
import { ContactEntity } from "../../../entities/contacts/contacts.entity";
import { GatewayContext } from "../../../gateway/gatewayContext";
import Message from "../../../components/visual/Message.component";
import { io, Socket } from 'socket.io-client';
import { MessageEntity } from "../../../entities/contacts/messageEntity.entity";
import { UserEntity } from "../../../entities/contacts/user.entity";
import ConfirmationDialog from "../../../components/confirmDialog/confirmDialog";

const SOCKET_SERVER_URL = 'http://localhost:4000';

function Contacts() {
    const [contacts, setContacts] = useState<ContactEntity[]>([]);
    const [selectedContact, setSelectedContact] = useState<ContactEntity | null>(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isAbleBlock, setIsAbleBlock] = useState<boolean>(false);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [uuid, setUuid] = useState("");
    const [msg, setMsg] = useState({ msg: null, status: null });
    const messagesEndRef = useRef(null);

    const contactsGateway = useContext(GatewayContext)?.contactsGateway;
    const messagesGateway = useContext(GatewayContext)?.messagesGateway;
    const profileGateway = useContext(GatewayContext)?.profileGateway;

    const [initialLoad, setInitialLoad] = useState(true);

    const scrollToBottom = (shouldScroll = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: shouldScroll ? "smooth" : "instant" });
    };

    async function handleContactClick(contact: ContactEntity) {
        setNewMessage("");
        setSelectedContact(contact);
        setInitialLoad(true);
        scrollToBottom(false);
    }

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (message) => {
            setContacts(prevContacts => {
                const updatedContacts = prevContacts.map(contact => {
                    if (contact.uuid() === message.props.chatUuid) {
                        return new ContactEntity({
                            ...contact.props,
                            messages: [...(contact.messages() || []), new MessageEntity({
                                chatUuid: message.props.chatUuid,
                                sender: new UserEntity(message.props.sender.props),
                                text: message.props.text,
                                uuid: message.props.uuid,
                            })]
                        });
                    }
                    return contact;
                });

                return updatedContacts;
            });

            setSelectedContact(prevSelectedContact => {
                if (prevSelectedContact && prevSelectedContact.uuid() === message.props.chatUuid) {
                    return new ContactEntity({
                        ...prevSelectedContact.props,
                        messages: [...(prevSelectedContact.messages() || []), new MessageEntity({
                            chatUuid: message.props.chatUuid,
                            sender: new UserEntity(message.props.sender.props),
                            text: message.props.text,
                            uuid: message.props.uuid,
                        })]
                    });
                }
                return prevSelectedContact;
            });

            setInitialLoad(false);
            scrollToBottom();
        };

        const handleDeleteMessage = (messageUuid: string) => {
            setContacts(prevContacts => {
                const updatedContacts = prevContacts.map(contact => {
                    if (contact.messages().some(msg => msg.uuid() === messageUuid)) {
                        return new ContactEntity({
                            ...contact.props,
                            messages: contact.messages().filter(msg => msg.uuid() !== messageUuid)
                        });
                    }
                    return contact;
                });

                return updatedContacts;
            });

            setSelectedContact(prevSelectedContact => {
                if (prevSelectedContact && prevSelectedContact.messages().some(msg => msg.uuid() === messageUuid)) {
                    return new ContactEntity({
                        ...prevSelectedContact.props,
                        messages: prevSelectedContact.messages().filter(msg => msg.uuid() !== messageUuid)
                    });
                }
                return prevSelectedContact;
            });
        };

        const handleBlockContact = (contactUuid: string) => {
            setContacts(prevContacts => prevContacts.filter(contact => contact.uuid() !== contactUuid));

            setSelectedContact(prevSelectedContact => {
                if (prevSelectedContact && prevSelectedContact.uuid() === contactUuid) {
                    return null;
                }
                return prevSelectedContact;
            });
        };

        socket.on('block-contact', handleBlockContact);
        socket.on('delete-message', handleDeleteMessage);
        socket.on('send-message', handleMessage);

        return () => {
            if (socket) {
                socket.off('send-message', handleMessage);
                socket.off('delete-message', handleDeleteMessage);
                socket.off('block-contact', handleBlockContact);
            }
        };
    }, [socket, selectedContact]);

    useEffect(() => {
        GetContacts();
        const newSocket: Socket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    async function GetContacts() {
        const res = await profileGateway?.findUserByEmail();
        setUuid(res?.user?.uuid() as string);
        const response = await contactsGateway?.getContacts();
        setContacts(response?.contacts as ContactEntity[]);
    }

    const HandleOnChangeSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(event.target.value);
        scrollToBottom();
    };

    const sendMessage = async () => {
        setMsg({ msg: null, status: null });
        if (selectedContact) {
            const response = await messagesGateway?.sendMessage(newMessage, selectedContact.uuid());
            setMsg({ msg: response?.message, status: response?.status });
        }
        setNewMessage("");
        scrollToBottom();
    };

    const handleKeyDown = (e) => {
        if (newMessage.length > 0) {
            if (e.key === "Enter") {
                sendMessage();
            }
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
        if (selectedContact) {
            scrollToBottom(initialLoad ? false : true);
            setInitialLoad(false);
        }
    }, [selectedContact, selectedContact?.messages()]);

    const filteredContacts = contacts.filter(contact => {
        const firstUserName = contact.firstUser().userName().toLowerCase();
        const secondUserName = contact.secondUser().userName().toLowerCase();
        return firstUserName.includes(search.toLowerCase()) || secondUserName.includes(search.toLowerCase());
    });

    async function BlockUser() {
        setMsg({ msg: null, status: null });
        if (selectedContact) {
            const data = await contactsGateway?.blockUser(selectedContact.uuid());
            setMsg({ msg: data?.message, status: data?.status });
        }
        setIsAbleBlock(false);
    }

    async function cancelBlockUser() {
        setIsAbleBlock(false);
    }

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
            {isAbleBlock && (
                <ConfirmationDialog
                    message="Você tem certeza que quer bloquear esse usuario?"
                    onConfirm={BlockUser}
                    onCancel={cancelBlockUser}
                />
            )}
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="users-container-contacts">
                            <div className="d-flex flex-wrap justify-content-center mb-4 m-2">
                                <Link to={`/home/contacts/add`} className="me-2 mb-2 mb-md-0">
                                    <button type="button" className="btn btn-info add-btn d-flex align-items-center justify-content-center">
                                        <IoMdPersonAdd className="icon me-2" />
                                        <span className="add-text">Adicionar</span>
                                    </button>
                                </Link>
                                <Link to={`/home/contacts/blocked`} className="mb-2 mb-md-0">
                                    <button type="button" className="btn btn-danger block-btn d-flex align-items-center justify-content-center">
                                        Contatos Bloqueados
                                    </button>
                                </Link>
                            </div>

                            <div className="chat-search-box">
                                <div className="input-group">
                                    <input className="form-control" placeholder="Procurar" onChange={HandleOnChangeSearch} value={search} />
                                    <div className="input-group-btn">
                                    </div>
                                </div>
                            </div>

                            <ul className="users">
                                                {!loading && filteredContacts && filteredContacts.length > 0 && filteredContacts.map((contact, index) => (
                                                    <li
                                                        className={`person ${selectedContact === contact ? 'active' : ''}`}
                                                        data-chat="person1"
                                                        key={index}
                                                        onClick={() => handleContactClick(contact)}
                                                    >
                                                        <div className="user">
                                                            <img src={contact.firstUser().uuid() === uuid ? contact.secondUser().avatar() : contact.firstUser().avatar()} />
                                                            <span className="status busy"></span>
                                                        </div>
                                                        <p className="name-time">
                                                            <span className="name">{contact.firstUser().uuid() === uuid ? contact.secondUser().userName() : contact.firstUser().userName()}</span>
                                                        </p>
                                                    </li>
                                                ))}
                                                {!loading && filteredContacts.length === 0 && (
                                                    <li className="no-contacts">Nenhum contato encontrado</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                    <div className="col-md-8">
                                        {selectedContact ? (
                                            <div className="selected-user">
                                                <span>To: <span className="name">
                                                    {selectedContact.firstUser().uuid() === uuid 
                                                        ? selectedContact.secondUser().userName() 
                                                        : selectedContact.firstUser().userName()}
                                                </span></span>
                                                <button className="cancel-button" type="button" onClick={() => setIsAbleBlock(true)}>Bloquear</button>
                                            </div>
    
                                        ) : (
                                            <div className="selected-user">
                                                <span>Selecione algum contato</span>
                                            </div>
                                        )}
                                        <div className="chat-container">
                                        {selectedContact ? (
                                            <ul className="chat-box chatContainerScroll">
                                                {selectedContact.messages().map((message, index) => (
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
                                        ) : (
                                            <div className="no-chat-selected">Nenhum contato selecionado</div>
                                        )}

                                            {selectedContact && (
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
                                            )}
                                        </div>
                                    </div>
            </div>
            {isDialogVisible && (
                <ConfirmationDialog
                    message="Você tem certeza que quer deletar esta mensagem?"
                    onConfirm={confirmDeleteMessage}
                    onCancel={cancelDeleteMessage}
                />
            )}
            {isAbleBlock && (
                <ConfirmationDialog
                    message="Você tem certeza que quer bloquear esse usuário?"
                    onConfirm={BlockUser}
                    onCancel={cancelBlockUser}
                />
            )}
        </div>
        </>
    );    
}

export default Contacts;
