import { IoPersonCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import { MdContacts, MdGroups2 } from "react-icons/md";
import { IoIosLogOut, IoIosNotifications } from "react-icons/io";
import './style.css';
import { useContext, useEffect, useState } from "react";
import { GatewayContext } from "../../gateway/gatewayContext";
import { io, Socket } from 'socket.io-client';
import CookieFactory from "../../utils/cookieFactory";

const SOCKET_SERVER_URL = 'http://localhost:4000';

function NavBar() {
    const [notifications, setNotifications] = useState<number>(0);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [uuid, setUuid] = useState("");

    const notificationGateway = useContext(GatewayContext)?.notificationGateway;
    useEffect(() => {
        getNotifications();
        getUser();
        const newSocket: Socket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [])

    useEffect(() => {
        if (!socket) return;
        async function HandleReceiveNotify(uuids: string[]) {
            if (uuids.includes(uuid)) {
                setNotifications((prev) => prev + 1);
            }
        }
        async function HandleRemoveNotify(uuidRec: string) {
            if (uuidRec === uuid) {
                setNotifications(0);
            }
        }
        socket.on('new-notify', HandleReceiveNotify);
        socket.on('remove-notify', HandleRemoveNotify);

        return () => {
            if (socket) {
                socket.off('new-notify', HandleReceiveNotify);
                socket.off('remove-notify', HandleRemoveNotify);
            }
        };
    }, [socket]);

    async function getNotifications() {
        const response = await notificationGateway?.getAmountNotifications();
        setNotifications(response?.amount || 0);
    }
    async function getUser() {
       const cookie = await new CookieFactory().getCookie("user");
        setUuid(cookie.uuid)
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/home/index">LseuxLink</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item me-4 itens">
                            <Link className="nav-link active" aria-current="page" to="/home/index">
                                <FaHome className="icon" /> Inicio
                            </Link>
                        </li>
                        <li className="nav-item me-4 itens">
                            <Link className="nav-link active" aria-current="page" to="/home/profile">
                                <IoPersonCircleOutline className="icon" /> Perfil
                            </Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link" to="/home/contacts">
                                <MdContacts className="icon" /> Contatos
                            </Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link" to="/home/chats">
                                <MdGroups2 className="icon" /> Grupos
                            </Link>
                        </li>
                        <li className="nav-item me-4 position-relative">
                            <Link  className="nav-link" to="/home/notifications">
                                <IoIosNotifications className="icon" /> 
                                {notifications > 0 && (
                                    <span className="badge">{notifications}</span>
                                )} Notificações
                            </Link>
                        </li>
                        <li className="nav-item me-4  ms-auto">
                            <Link className="nav-link" to="/sair">
                                <IoIosLogOut className="icon" /> Sair
                            </Link>
                        </li>
                    </ul>
                </div> 
            </div>
        </nav>
    );
}

export default NavBar;
