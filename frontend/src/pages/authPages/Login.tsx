import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { UserEntity } from "../../entities/auth/User.entity";
import Loader from "../../components/visual/Loader";
import Message from "../../components/visual/Message.component";
import { GatewayContext } from "../../gateway/gatewayContext";
import { useNavigate } from "react-router";
import CookieFactory from "../../utils/cookieFactory";
export type loginInput = {
    email: string;
    password: string;
}
function Login() {
    const navigate = useNavigate();
    const gatewayContext = useContext(GatewayContext);
    const factory =  new CookieFactory();
    const userGateway = gatewayContext?.userGateway;

    const [msg, setMsg] = useState({ msg: null, status: null });
    const [loading, setLoading] = useState(false);
    const [loginInput, setLoginInput] = useState<loginInput>({email: "", password: ""});
    const [user, setUser] = useState<UserEntity>(new UserEntity({ email: '', userName: '', avatar: '', phone_number: '', password: '' }));

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginInput((prevState) => ({ ...prevState, [name]: value }));
      };    
    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMsg({msg: null, status: null});
        const response = await userGateway?.Login(loginInput);
        setMsg({msg: response?.message, status: response?.status})
        setUser(response?.user);
        if (response && response.status && response.status > 300 && response?.message === "Esse email já existe mas não foi verificado ainda, verifique sua caixa de email ou peça reenvio do token") {
            setTimeout(() => navigate(`/verify/account/token/${loginInput.email}`), 3000);
        }
        if (response && response.status < 300) {
            await factory.addCookie("user", response.user?.props);
            setTimeout(() => navigate(`/home/index`), 3000);
        }
        setLoading(false);
    }
    return (
        <div>
            {msg.msg && <Message msg={msg.msg} status={msg.status} timers={3000} />}
            <form className='form' onSubmit={submit}>
            {loading && <Loader />}
                <p className="title">Faça login para acessar o site</p>
                <label>
                <input
                    onChange={handleOnChange}
                    placeholder="email"
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
                <div className="buttons">
                    <div>
                        <button type="submit" className="submit">
                        Entrar
                        </button>
                    </div>
                </div>
                <p className='signin'>Não tem uma conta? vá para: <a href='/signup'>Cadastro</a></p>
            </form>
        </div>
    )
}
export default Login;