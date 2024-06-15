import React, { useContext, useEffect, useState } from 'react';
import "../../../../public/style/chats/blocked.css"; // Importa o CSS específico para a página
import ReactLoading from 'react-loading';
import { GatewayContext } from '../../../gateway/gatewayContext';
import { ContactEntity } from '../../../entities/contacts/contacts.entity';
import Message from '../../../components/visual/Message.component';

const BlockedContactsPage = () => {
    const contactsGateway = useContext(GatewayContext)?.contactsGateway;
    const profileGateway = useContext(GatewayContext)?.profileGateway;

    const [contacts, setContacts] = useState<ContactEntity[]>([]);
    const [msg, setMsg] = useState({ msg: null, status: null });

    const [uuid, setUuid] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleUnblock = async (contactUuid: string) => {
        setMsg({ msg: null, status: null });
        const response = await contactsGateway?.unblockContact(contactUuid);
        setMsg({ msg: response?.message, status: response?.status });
        if (response?.status < 300) {
            setContacts(contacts.filter(contact => contact.uuid() !== contactUuid));
        }

    };

    useEffect(() => {
        getContacts();
    }, []);

    async function getContacts() {
        setLoading(true);
        const res = await profileGateway?.findUserByEmail();
        setUuid(res?.user?.uuid() as string);
        const response = await contactsGateway?.findBlockedContacts();
        setContacts(response?.contacts as ContactEntity[]);
        setLoading(false);
    }

    return (
        <div className="blocked-users-container m-4">
            {loading && 
                <div className="col-sm-12 d-flex justify-content-center align-items-center m-4">
                    <ReactLoading type="spin" height={"30%"} width={"30%"} className="" color='black'/>
                </div>
            }
            {msg.msg && <Message msg={msg.msg} status={msg.status} timers={3000} />}
            {!loading && contacts.length > 0 && (
                <>
                    <div className="blocked-users-header">
                        <h2>Usuários Bloqueados</h2>
                    </div>
                    <div className="blocked-users-list">
                        {contacts.map((contact, index) => (
                            <div key={index} className="user-card-new d-flex align-items-center justify-content-between">
                                <div className="user-info">
                                    <img 
                                        src={contact.firstUser().uuid() === uuid ? contact.secondUser().avatar() : contact.firstUser().avatar()}  
                                        className='user-photo-new'
                                    />
                                    <span className='user-name-new'>
                                        {contact.firstUser().uuid() === uuid ? contact.secondUser().userName() : contact.firstUser().userName()}
                                    </span>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-info unblock-button" 
                                    onClick={() => handleUnblock(contact.uuid())}
                                >
                                    Desbloquear
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {!loading && contacts.length === 0 && (
                <div className="no-blocked-contacts">
                    <p>Nenhum contato bloqueado.</p>
                </div>
            )}
        </div>
    );
};

export default BlockedContactsPage;
