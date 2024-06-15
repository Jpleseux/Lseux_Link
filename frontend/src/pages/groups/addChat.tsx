import React, { useState, useEffect, useContext } from 'react';
import { UserEntity } from '../../entities/auth/User.entity';
import { GatewayContext } from '../../gateway/gatewayContext';
import "../../../public/style/chats/addChats.css"
import { SaveEntityInputDto } from '../../gateway/interfaces/chats/chatsGateway';
import Message from '../../components/visual/Message.component';
import { useNavigate } from 'react-router';

function AddChat() {
    const [chatName, setChatName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<UserEntity[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserEntity[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ msg: null, status: null });
    const navigate = useNavigate();

    const groupsGateway = useContext(GatewayContext)?.chatsGateway;

    const handleChatNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChatName(e.target.value);
    };

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const searchUsers = async () => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            return;
        }
        const response = await groupsGateway?.findContactUsers(searchTerm);
        if (response && response.status < 300) {
            const filteredResults = response.user?.filter(user => !selectedUsers.some(u => u.uuid() === user.uuid()));
            setSearchResults(filteredResults as []);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchUsers();
        }, 500); 

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const addUserToChat = (user: UserEntity) => {
        if (!selectedUsers.some(u => u.uuid() === user.uuid())) {
            setSelectedUsers([...selectedUsers, user]);
            setSearchResults(searchResults.filter(u => u.uuid() !== user.uuid()));
        }
    };

    const removeUserFromChat = (user: UserEntity) => {
        setSelectedUsers(selectedUsers.filter(u => u.uuid() !== user.uuid()));
        if (user.userName().toLowerCase().includes(searchTerm.toLowerCase())) {
            setSearchResults([...searchResults, user]);
        }
    };
    const saveChat = async () => {
        if (loading === false) {
            setMsg({ msg: null, status: null });
            const input: SaveEntityInputDto = {
                name: chatName,
                type: "groups",
                users: selectedUsers.map((user) => {
                    return user.uuid()
                }) as string [],
            }
            const response = await groupsGateway?.saveChat(input);
            setMsg({ msg: response?.message, status: response?.status });
            if (response?.status < 300) {
                setLoading(true)
                setTimeout(() => {
                  navigate("/home/chats");
                }, 3000);
            }
        }
    }

    return (
        <>
        {msg.msg && <Message msg={msg.msg} status={msg.status} timers={3000} />}
        <div className="add-chat-container">
            <h2>Adicionar Novo Chat</h2>
            <div className="form-group">
                <label>Nome do Chat:</label>
                <input
                    type="text"
                    className="form-control"
                    value={chatName}
                    onChange={handleChatNameChange}
                    placeholder="Digite o nome do chat"
                />
            </div>

            <div className="form-group">
                <label>Procurar Usuários:</label>
                <input
                    type="text"
                    className="form-control"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder="Digite o nome do usuário"
                />
            </div>

            {searchResults.length > 0 && (
                <div className="search-results">
                    <h4>Resultados da Pesquisa:</h4>
                    <ul>
                        {searchResults
                            .filter(user => !selectedUsers.some(u => u.uuid() === user.uuid()))
                            .map((user, index) => (
                                <li
                                    key={index}
                                    className="user-card-new d-flex align-items-center justify-content-between"
                                    onClick={() => addUserToChat(user)}
                                >
                                    <div className="user-info">
                                        <img
                                            src={user.avatar()}  
                                            alt={`${user.userName()} avatar`}
                                            className='user-photo-new'
                                        />
                                        <span className='user-name-new'>{user.userName()}</span>
                                    </div>
                                    <button type="button" className="btn btn-info">
                                        Adicionar
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )}

            {selectedUsers.length > 0 && (
                <div className="selected-users">
                    <h4>Usuários Selecionados:</h4>
                    <ul>
                        {selectedUsers.map((user, index) => (
                            <li key={index} className="d-flex align-items-center justify-content-between">
                                <div className="user-info">
                                    <img
                                        src={user.avatar()} 
                                        alt={`${user.userName()} avatar`}
                                        className='user-photo-new'
                                    />
                                    <span className='user-name-new'>{user.userName()}</span>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeUserFromChat(user)}
                                >
                                    Remover
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button className="btn btn-primary" onClick={saveChat}>Criar Chat</button>
        </div>
        </>
    );
}

export default AddChat;
