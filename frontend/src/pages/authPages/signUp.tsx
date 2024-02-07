import React, { useContext, useState, ChangeEvent, FormEvent, useEffect } from 'react';
import '../../../public/style/auth/signUp.css';
import Message from '../../components/visual/Message.component';
import { GatewayContext } from '../../gateway/gatewayContext';
import { UserEntity } from '../../entities/auth/User.entity';
import Loader from '../../components/visual/Loader';
import { useNavigate } from 'react-router';
function SignUp() {
  const navigate = useNavigate()
  const gatewayContext = useContext(GatewayContext);
  const userGateway = gatewayContext?.userGateway;
  const [user, setUser] = useState<UserEntity>(new UserEntity({ email: '', userName: '', avatar: '', phone_number: '' }));
  const [msg, setMsg] = useState({msg:null, status: null});
  const [loading, setLoading] = useState(false);
  async function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser((prevState) => {
      const newUser = new UserEntity({ ...prevState.props, [name]: value });
      return newUser;
    });
  }
  useEffect(() => {
    if (loading) {
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.pointerEvents = 'auto';
    }
  }, [loading])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg({msg: null, status: null})
    const response = await userGateway?.signUp(user);
    setMsg({msg: response?.message, status: response?.status});
    if (msg.status > 300 && msg.msg !== "Esse email já existe mas não foi verificado ainda, verifique sua caixa de email ou peça reenvio do token") {
      setTimeout(() => {
        navigate("/", {replace: true});
      }, 2000)
    } else if (msg.msg === "Esse email já existe mas não foi verificado ainda, verifique sua caixa de email ou peça reenvio do token") {
      setTimeout(() => {
        navigate(`/verify/account/token/${response?.user?.email()}`, {replace: true});
      }, 2000)
    }
    setLoading(false);
  }

  return (
    <div className="signBody">
      {msg.msg && 
        <Message msg={msg.msg} status={msg.status} timers={3000} />
      }
      <form className="form" onSubmit={submit}>
        {loading && 
                <Loader />
        }
        <p className="title">Cadastre-se</p>
        <p className="message">Cadastre-se para ter acesso ao site.</p>
        <label>
          <input
            onChange={handleOnChange}
            placeholder="Nome"
            type="text"
            className="input"
            name="userName"
          />
        </label>
        <label>
          <input
            onChange={handleOnChange}
            placeholder="Email"
            type="email"
            className="input"
            name="email"
          />
        </label>
        <label>
          <input
            onChange={handleOnChange}
            placeholder="Numero de telefone"
            type="text"
            className="input"
            name="phone_number"
          />
        </label>
        <label>
          <input
            onChange={handleOnChange}
            placeholder="Senha"
            type="password"
            className="input"
            name="password"
          />
        </label>
        <label>
          <input
            placeholder="Confirme sua senha"
            type="password"
            className="input"
            name="confirmPassword"
          />
        </label>
        <div className="buttons">
        <button type="submit" className="submit">
          Cadastrar
        </button>
        </div>
        <p className="signin">
          Já tem uma conta ? <a href="#">Login</a>{' '}
        </p>
      </form>
    </div>
  );
}

export default SignUp;
