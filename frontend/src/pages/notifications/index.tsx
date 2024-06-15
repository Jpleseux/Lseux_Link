import { useContext, useEffect, useState } from "react";
import "../../../public/style/notifications/index.css";
import { GatewayContext } from "../../gateway/gatewayContext";
import { NotificationEntity } from "../../entities/notifications/notification.entity";
import UserCardSimple from "../../components/userCards/usercardSimple";
import Message from "../../components/visual/Message.component";
import ReactLoading from 'react-loading';

function Notifications() {
    const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
    const notificationGateway = useContext(GatewayContext)?.notificationGateway;
    const contactsGateway = useContext(GatewayContext)?.contactsGateway;
    const [msg, setMsg] = useState({ msg: null, status: null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getNotifications();
        setReadedNotifications();
    }, [])
    async function setReadedNotifications() {
        await notificationGateway?.setReadedNotifications();
    }
    async function getNotifications() {
        setLoading(true);
        const response = await notificationGateway?.getNotifications();
        setNotifications(response?.notifications || []);
        setLoading(false);
    }
    async function AcceptInvite(uuid: string, notification: string) {
        setMsg({ msg: null, status: null });
        const response = await contactsGateway?.saveContact(uuid);
        if (response?.status < 300 || response?.message === "Esse contato ja existe") {
            await deleteNotification(notification);
        } 
        setMsg({msg: response?.message, status: response?.status})
    }
    async function deleteNotification(notificationId: string) {
        await notificationGateway?.deleteNotifications(notificationId);
        setNotifications(prevNotifications => prevNotifications.filter(notification => notification.Uuid() !== notificationId));
    }

    return (
        <>
        {msg.msg && <Message msg={msg.msg} status={msg.status} timers={3000} />}
        <div className="notifications-container">
            {!loading && notifications.map(notification => (
                <div key={notification.Uuid()} className="notification-card">
                    <div className="card-content">
                        <div >
                            <h4>{notification.IsInvite() === true ? "Nova solicitação de amizade" : "Nova Notificação"}</h4>
                        </div>
                        <div className="card-message">
                            <h6>{notification.Message()}</h6>
                        </div>
                        {notification.From() &&
                        <div className="card-title">
                            <h4>Enviado por: </h4>
                            <UserCardSimple name={notification.From().userName()} photo={notification.From().avatar()}/>
                        </div>
                        }
                        {notification.IsInvite() === true &&
                            <div style={{marginTop: "1%"}}>
                                <button className="btn btn btn-secondary" style={{marginRight: "5%"}} onClick={() => AcceptInvite(notification.From().uuid() as string, notification.Uuid())}>Aceitar</button>
                                <button className="btn btn btn-danger">Rejeitar</button>
                            </div>
                        }
                    </div>
                </div>
            ))}
            {!loading && notifications && notifications.length === 0 &&
                <h3 className="text-center"><b>Nenhuma Notificação</b></h3>
            }
        {loading && (
            <div className="col-sm-12 d-flex justify-content-center align-items-center m-4">
                <ReactLoading type="spokes" height={"20%"} width={"30%"} />
            </div>
        )}
        </div>
        </>
    );
}

export default Notifications;
