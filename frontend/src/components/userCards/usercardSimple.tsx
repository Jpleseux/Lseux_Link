function UserCardSimple({ name, photo }) {
    return (
        <div className="user-card-new">
            <img src={photo} alt={`${name}'s photo`} className="user-photo-new" />
            <div className="user-info-new">
                <h6 className="user-name-new">{name}</h6>
            </div>
        </div>
    );
}

export default UserCardSimple;
