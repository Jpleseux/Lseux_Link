import { IoMdPersonAdd } from "react-icons/io";

function UserCard({ name, photo, uuid }) {
    return (
        <div className="user-card">
            <img src={photo} alt={`${name}'s photo`} className="user-photo" />
            <div className="user-info">
                <h6 className="user-name">{name}</h6>
            </div>
            <button type="button" className="btn btn-info add-btn">
                <IoMdPersonAdd className="icon" />
                <span className="add-text">Adicionar</span>
            </button>
        </div>
    );
}

export default UserCard;
