import { IoMdPersonAdd } from "react-icons/io";
import "../../../../public/style/chats/contacts.css";
import { Link } from "react-router-dom";

function Contacts() {
    return (
        <div className="container groups">
            <div className="content-wrapper">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="card m-0">
                            <div className="row no-gutters">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                                    <div className="users-container">
                                    <Link to={`/home/contacts/add`}>
                                        <button type="button" className="btn btn-info add-btn">
                                                <IoMdPersonAdd className="icon" />
                                                <span className="add-text">Adicionar</span>
                                        </button>
                                    </Link>
                                        <div className="chat-search-box">
                                            <div className="input-group">
                                                <input className="form-control" placeholder="Search"/>
                                                <div className="input-group-btn">
                                                    <button type="button" className="btn btn-info">
                                                        <i className="fa fa-search">Procurar</i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="users">
                                            <li className="person" data-chat="person1">
                                                <div className="user">
                                                    <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin"/>
                                                    <span className="status busy"></span>
                                                </div>
                                                <p className="name-time">
                                                    <span className="name">Steve Bangalter</span>
                                                    <span className="time">15/02/2019</span>
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                                    <div className="selected-user">
                                        <span>To: <span className="name">Emily Russell</span></span>
                                    </div>
                                    <div className="chat-container">
                                        <ul className="chat-box chatContainerScroll">
                                            <li className="chat-left">
                                                <div className="chat-avatar">
                                                    <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin"/>
                                                    <div className="chat-name">Russell</div>
                                                </div>
                                                <div className="chat-text">Hello, I'm Russell.
                                                    <br/>How can I help you today?</div>
                                                <div className="chat-hour">08:55 <span className="fa fa-check-circle"></span></div>
                                            </li>
                                        </ul>
                                        <div className="form-group mt-3 mb-0">
                                            <textarea className="form-control" rows="3" placeholder="Type your message here..."></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>    
    )
}

export default Contacts;
