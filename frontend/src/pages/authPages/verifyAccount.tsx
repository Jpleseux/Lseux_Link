import React, { ChangeEvent, useEffect, useState } from 'react';
import Input from '../../components/forms/input';
import { useParams } from 'react-router';
import Message from '../../components/visual/Message.component';
import Loader from '../../components/visual/Loader';

function VerifyAccount() {
  const [token, setToken] = useState<string | undefined>('');
  const { token: tokenParam } = useParams();
  const { email: emailParam } = useParams();
  const [msg, setMsg] = useState({ msg: null, status: null });
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    setToken(e.target.value);
  }
  async function resendToken() {
    console.log("Ok")
  }

  useEffect(() => {
    setToken(tokenParam);
  }, [tokenParam]);

  useEffect(() => {
    setCountdown(30);
    const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {msg.msg && <Message msg={msg.msg} status={msg.status} timers={3000} />}
      <form className='form'>
        {loading && <Loader />}
        <p className="title">Verifique sua conta</p>
        <p className="message">Verifique sua conta para acessar o sistema.</p>
        <Input handleOnChange={handleOnChange} value={token} name='token' type='text' placeholder='Insira seu token' />
        <div className="buttons">
        <button type="submit" className="submit">
          Verificar Conta
        </button>
        </div>
        <p className="signin">Não recebeu o email de verificação ?</p>
        <div className="buttons">
        {countdown > 0 ? <p>{`Reenviar em ${countdown} segundos`} </p>:           
            <div>
                <button onClick={resendToken} type="button" className="resend" disabled={countdown > 0}>
                Reenviar email
                </button>
            </div>
        }
        </div>
        <a href="/">
            <button type="button" className="submit">
                Login
            </button>
        </a>
      </form>
    </div>
  );
}

export default VerifyAccount;
