import React, { useContext, useState, ChangeEvent, FormEvent } from 'react';
import '../../../public/style/auth/signUp.css';
import Message from '../../components/visual/Message.component';
import { GatewayContext } from '../../gateway/gatewayContext';
import { UserEntity } from '../../entities/auth/User.entity';

function SignUp() {
  const gatewayContext = useContext(GatewayContext);
  const userGateway = gatewayContext?.userGateway;
  const [user, setUser] = useState<UserEntity>(new UserEntity({ email: '', userName: '', avatar: '' }));
  const [msg, setMsg] = useState<string>();
  async function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser((prevState) => {
      const newUser = new UserEntity({ ...prevState.props, [name]: value });
      return newUser;
    });
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await userGateway?.signUp(user);
    console.log(response);
  }

  return (
    <div className="signBody">
      {msg && 
        <Message msg={"OK"} status={404} timers={3000} />
      }
      <form className="form" onSubmit={submit}>
        <p className="title">Cadastre-se</p>
        <p className="message">Cadastre-se para ter acesso ao site.</p>
        <label>
          <input
            onChange={handleOnChange}
            placeholder="Nome"
            type="text"
            className="input"
            name="name"
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
        <button type="submit" className="submit">
          Cadastrar
        </button>
        <p className="signin">
          Já tem uma conta ? <a href="#">Login</a>{' '}
        </p>
      </form>
    </div>
  );
}

export default SignUp;
