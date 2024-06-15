import { useContext, useEffect, useState } from "react";
import { IoMdPersonAdd } from "react-icons/io";
import { GatewayContext } from "../../gateway/gatewayContext";
import Message from "../visual/Message.component";

function UserCard({ name, photo, uuid }) {
    const notificationGateway = useContext(GatewayContext)?.notificationGateway;
    const profileGateway = useContext(GatewayContext)?.profileGateway;
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ msg: null, status: null });
    const [user, setUser] = useState({
        email: '',
        uuid: '',
        userName: '',
        avatar: '',
        phone_number: '',
        password: '',
      });
    useEffect(() => {
        getUser();
    }, [])

    const getUser = async () => {
        setLoading(true);
        const response = await profileGateway?.findUserByEmail();
        if (response?.user?.props) {
          const { avatar, email, password, userName, phone_number, uuid } = response.user.props;
          setUser({ avatar, email, password, userName, phone_number, uuid });
        }
        setLoading(false);
    };

    async function saveInviteNotification() {
        setMsg({ msg: null, status: null });
        const response = await notificationGateway?.saveNotification({
            message: `O usuario ${user.userName} pediu sua amizade`,
            to: [uuid],
            type: "personal",
            from: user.uuid,
            invite: true,
        })
        setMsg({msg: response?.message, status: response?.status});
    }
    return (
        <div className="user-card-new">
            {msg.msg && <Message msg={msg.msg} status={msg.status} timers={3000} />}
            <img src={photo} alt={`${name}'s photo`} className="user-photo-new" />
            <div className="user-info-new">
                <h6 className="user-name-new">{name}</h6>
            </div>
            <button type="button" className="btn btn-info add-btn-new" onClick={saveInviteNotification}>
                <IoMdPersonAdd className="icon-new" />
                <span className="add-text-new">Adicionar</span>
            </button>
        </div>
    );
}

export default UserCard;
