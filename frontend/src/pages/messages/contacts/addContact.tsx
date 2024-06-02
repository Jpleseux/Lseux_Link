import React, { useContext, useState } from "react";
import { GatewayContext } from "../../../gateway/gatewayContext";
import "../../../../public/style/chats/contacts.css";
import UserCard from "../../../components/userCards/usercard";
import { UserEntity } from "../../../entities/chats/user.entity";
import ReactLoading from 'react-loading';

function AddContact() {
    const chatsGateway = useContext(GatewayContext)?.chatsGateway;
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<UserEntity[]>([]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            find();
        }
    };
    const find = async () => {
        setLoading(true);
        if (query.length === 0) {
            setLoading(false);
            return;
        }
        const response = await chatsGateway?.findContactUsers(query);
        if (response && response.user) {
            setUsers(response.user);
        } else {
            setUsers([]);
        }
        setLoading(false);
    };

    return (
        <div className="container-fluid full-screen-container">
            <div className="content-wrapper full-screen-content">
                <div className="row justify-content-center align-items-center full-height">
                    <div className="col-12">
                        <div className="card m-0 full-screen-card">
                            <div className="users-container full-screen-users">
                                <div className="add-contact-container">
                                    <div className="m-3">
                                        <div className="input-group">
                                            <input
                                                className="form-control"
                                                placeholder="Nome"
                                                value={query}
                                                onChange={handleInputChange}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <div className="input-group-btn">
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={find}
                                                >
                                                    {loading ? "Procurando..." : "Procurar"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="user-card-container p-4">
                                        {users && users.length > 0 && loading !== true && users.map((user, index) => (
                                            <UserCard 
                                                key={index}
                                                name={user.userName()}
                                                photo={user.avatar()}
                                                uuid={user.uuid()}
                                            />
                                        ))
                                        }
                                        {loading === true &&
                                            <div className="col-sm-12 d-flex justify-content-center align-items-center m-4">
                                                <ReactLoading type="spin" height={"20%"} width={ "30%" } className="" color="gray"/>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default AddContact;
