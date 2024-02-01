import '../../../public/style/auth/signUp.css';

function SignUp() {
  return (
    <div className="signBody">
    <form className="form">
    <p className="title">Cadastre-se </p>
    <p className="message">Cadastre-se para ter acesso ao site. </p>
    <label>
        <input placeholder="Nome" type="text" className="input"/>
    </label>     
    <label>
        <input placeholder="Email" type="email" className="input" />
    </label> 
        
    <label>
        <input placeholder="Senha" type="password" className="input" />
    </label>
    <label>
        <input placeholder="Confirme sua senha" type="password" className="input" />
    </label>
    <button className="submit">Cadastrar</button>
    <p className="signin">Já tem uma conta ? <a href="#">Login</a> </p>
    </form>
    </div>
  );
}

export default SignUp;
