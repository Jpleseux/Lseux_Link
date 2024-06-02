import { IoPersonCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import { MdContacts, MdGroups2 } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import './style.css';

function NavBar() {
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
                            <Link className="nav-link" to="/grupos">
                                <MdGroups2 className="icon" /> Grupos
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
