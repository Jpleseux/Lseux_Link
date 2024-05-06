import React, { useEffect } from 'react';
import { MdGroups2, MdContacts } from 'react-icons/md';
import { IoIosLogOut, IoIosMenu } from 'react-icons/io';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';
import { FaHome } from 'react-icons/fa';

import './style.css';
import { useNavigate } from 'react-router';

function NavBar() {
  const navigate = useNavigate();

  async function toggle() {
    const container = document.getElementById('container');
    if (container) {
      container.classList.toggle('active');
    }
  }

  return (
    <div className="master">
      <div className="container" id="container">
        <div className="brand">
          <h3>Lseux_Link</h3>
          <a href="#" id="toggle" onClick={toggle}>
            <IoIosMenu />
          </a>
        </div>
        <div className="navbar">
          <ul>
            <li>
              <a href="/home/index" >
                <FaHome />
                <span>Inicio</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate("/home/profile")}>
                <IoPersonCircleOutline />
                <span>Perfil</span>
              </a>
            </li>
            <li>
              <a href="#">
                <MdContacts />
                <span>Contatos</span>
              </a>
            </li>
            <li>
              <a href="#">
                <MdGroups2 />
                <span>Grupos</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar">
          <ul>
            <li>
              <a href="#">
                <IoIosLogOut />
                <span>Sair</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
