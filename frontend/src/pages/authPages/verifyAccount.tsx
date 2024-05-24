import { FormEvent, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Message from '../../components/visual/Message.component';
import Loader from '../../components/visual/Loader';
import { GatewayContext } from '../../gateway/gatewayContext';

function VerifyAccount() {
  const gatewayContext = useContext(GatewayContext);
  const userGateway = gatewayContext?.userGateway;
  const navigate = useNavigate();
  const {token} = useParams();
  const {email} = useParams();
  const [msg, setMsg] = useState({ msg: null, status: null });
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  async function resendToken() {
    if (email) {
      setCountdown(100);
      setMsg({msg: null, status: null});
      const response = await userGateway?.ResendEmailVerifyAccountToUser(email);
      setLoading(true);
      setMsg({msg: response?.message, status: response?.status});
      setTimeout(() => {
        setLoading(false);
      }, 2000)
    }
  }
  async function Counter() {
    setCountdown(100);
    const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(interval);
  }
  async function verifyToken() {
    if (token) {
      setMsg({msg: null, status: null});
      const response = await userGateway?.verifyAccount(token);
      setLoading(true);
      setMsg({msg: response?.message, status: response?.status});
      if (response?.message === "Esse usuario já foi verificado") {
        document.body.style.pointerEvents = loading ? 'none' : 'auto';
        setTimeout(() => navigate("/"), 3000);
      } else if (response?.status >= 300) {
        document.body.style.pointerEvents = loading ? 'none' : 'auto';
        setTimeout(() => navigate("/"), 3000);
      }
      setLoading(false);
    }
  }
  useEffect(() => {
    verifyToken();
  }, [token]);
  useEffect(() => {
    Counter();
  }, [])
  useEffect(() => {
    document.body.style.pointerEvents = loading ? 'none' : 'auto';
  }, [loading]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }
  return (
    <div>
      {msg.msg && <Message msg={msg.msg} status={msg.status} timers={3000} />}
      <form className='form' onSubmit={submit}>
        {loading && <Loader />}
        <p className="title">Verifique sua conta pelo email que enviamos</p>
        <p className="message">Verifique sua conta para acessar o sistema.</p>
        <p className="signin">Não recebeu o email de verificação ?</p>
        <div className="buttons">
        {countdown > 0 ? <p>{`Reenviar em ${countdown} segundos`} </p>:           
            <div>
                <button onClick={resendToken} type="submit" className="submit" disabled={countdown > 0}>
                Reenviar email
                </button>
            </div>
        }
        </div>
        <p className='signin'>Já verificou a conta, vá para: <a href='/'>Login</a></p>
      </form>
    </div>
  );
}

export default VerifyAccount;
