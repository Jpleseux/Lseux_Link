function UserCardSimple({ name, photo }) {
    return (
        <div className="user-card">
            <img src={photo} alt={`${name}'s photo`} className="user-photo" />
            <div className="user-info">
                <h6 className="user-name">{name}</h6>
            </div>
        </div>
    );
}

export default UserCardSimple;
