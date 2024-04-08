import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../public/style/profile/profile.css";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { GatewayContext } from '../../gateway/gatewayContext';
import Message from '../../components/visual/Message.component';
import Loader from '../../components/visual/Loader';

enum Tab {
  General = "account-general",
  ChangePassword = "account-change-password",
}

function Profile() {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({
    email: '',
    userName: '',
    avatar: '',
    phone_number: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const [originalUser, setOriginalUser] = useState({});
  const [msg, setMsg] = useState({ msg: null, status: null });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.General);
  const gatewayContext = useContext(GatewayContext);
  const profileGateway = gatewayContext?.profileGateway;

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  const getUser = async () => {
    const response = await profileGateway?.findUserByEmail();
    setUser({
      avatar: response.user.props.avatar,
      email: response.user.props.email,
      password: response.user.props.password,
      userName: response.user.props.userName,
      phone_number: response.user.props.phone_number,
    });
    setOriginalUser({
      avatar: response.user.props.avatar,
      email: response.user.props.email,
      userName: response.user.props.userName,
      phone_number: response.user.props.phone_number,
    });
  };

  const cancelEdit = () => {
    setUser(originalUser);
    setEdit(false);
  };

  const handleOnImage = async (e: any) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith('image/jpeg') || file.type.startsWith('image/png')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const image64 = event.target?.result;
          setUser((prevUser) => ({
            ...prevUser,
            avatar: image64,
          }));
          await profileGateway?.changeAvatar(image64);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const changeUser = async (e: FormEvent<HTMLFormElement>) => {
    setMsg({msg: null, status: null});
    e.preventDefault();
    setLoading(true);
    const response = await profileGateway?.changeUser(user);
    setMsg({ msg: response?.message, status: response?.status });
    if (response?.status < 300) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
    setLoading(false);
  };

  const handleOnChangeUpdateUser = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };
  async function handleOnChangeRecoveryPassword(e: ChangeEvent<HTMLInputElement>) {
    const { value, name} = e.target;
    if (name === "confirm-password") {
        setConfirmPassword(value);
    } else {
        setNewPassword(value)
    }
  }
  async function ChangePassword(e: FormEvent<HTMLFormElement>) {
    setMsg({msg: null, status: null});
    e.preventDefault();
    setLoading(true);
    if (newPassword !== confirmPassword) {
        setMsg({msg: "As senhas não são iguais", status: 400})
    } else {
        const response = await profileGateway?.changePassword(newPassword);
        setMsg({ msg: response?.message, status: response?.status });
    }
    setLoading(false);
  }
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="container light-style flex-grow-1 container-p-y">
      {msg.msg && <Message msg={msg.msg} status={msg.status} timers={3000} />}
      <h4 className="font-weight-bold py-3 mb-4">
        Configurações de conta
      </h4>
      <div className="card overflow-hidden">
        <div className="row no-gutters row-bordered row-border-light">
          <div className="col-md-3 pt-0">
            <div className="list-group list-group-flush account-settings-links">
              <a
                className={`list-group-item list-group-item-action ${activeTab === Tab.General ? "active" : ""}`}
                onClick={() => handleTabClick(Tab.General)}
              >
                Geral
              </a>
              <a
                className={`list-group-item list-group-item-action ${activeTab === Tab.ChangePassword ? "active" : ""}`}
                onClick={() => handleTabClick(Tab.ChangePassword)}
              >
                Mudar sua senha
              </a>
            </div>
          </div>
          <div className="col-md-9">
            {loading && <Loader />}
            <div className="tab-content">
              <div className={`tab-pane fade ${activeTab === Tab.General ? "show active" : ""}`} id={Tab.General}>
                <div className="card-body media align-items-center">
                  {user.avatar && <img src={user.avatar} alt="" className="d-block ui-w-80 m-2" />}
                  {!user.avatar && <img src="../../../public/imgs/icon_avatar.png" alt="" className="d-block ui-w-80 m-2" />}
                  <div className="media-body ml-4">
                    <label className="btn btn-outline-primary">
                      Mudar foto
                      <input type="file" className="account-settings-fileinput" onChange={handleOnImage} accept=".jpg, .jpeg, .png" />
                    </label>{" "}
                    &nbsp;
                    <div className="text-light small mt-1">Aceito: JPG, JPEG or PNG. Tamanho máximo 800Kb</div>
                  </div>
                </div>
                <hr className="border-light m-0" />
                <form onSubmit={changeUser}>
                  <div className="card-body">
                    <div className="form-group">
                      <label className="form-label">Nome</label>
                      <input type="text" className="form-control mb-1" name='userName' value={user.userName} onChange={handleOnChangeUpdateUser} disabled={!edit} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Número de telefone</label>
                      <input type="text" className="form-control mb-1" name='phone_number' value={user.phone_number} onChange={handleOnChangeUpdateUser} disabled={!edit} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">E-mail</label>
                      <input type="text" className="form-control mb-1" name='email' value={user.email} onChange={handleOnChangeUpdateUser} disabled={!edit} />
                    </div>
                  </div>
                  {edit === false &&
                    <div className="text-center m-4">
                      <button type="button" onClick={() => setEdit(true)} className="btn btn-primary">Editar</button>
                    </div>
                  }
                  {edit === true &&
                    <div className="text-center m-4">
                      <button type="submit" className="btn btn-primary">Salvar alterações</button>{" "}
                      &nbsp;
                      <button type="button" className="btn btn-default" onClick={cancelEdit}>Cancelar</button>
                    </div>
                  }
                </form>
              </div>
              <div className={`tab-pane fade ${activeTab === Tab.ChangePassword ? "show active" : ""}`} id={Tab.ChangePassword}>
                  <form onSubmit={ChangePassword}>
                    <div className="card-body pb-2">
                    <div className="form-group">
                        <label className="form-label">Nova senha</label>
                        <input name='password' type="password" className="form-control" onChange={handleOnChangeRecoveryPassword}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Repita a nova senha</label>
                        <input name='confirm-password' type="password" className="form-control" onChange={handleOnChangeRecoveryPassword}/>
                    </div>
                    </div>
                    <div className="text-center m-4">
                        <button type="submit" className="btn btn-primary m-2">Mudar Senha</button>
                    </div>
                  </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
