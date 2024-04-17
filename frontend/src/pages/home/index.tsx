import { useEffect } from "react";
import CookieFactory from "../../utils/cookieFactory";

function Index() {
    const factory = new CookieFactory();

    async function getCookie() {
        console.log(await factory.getCookie("user"));
    }

    useEffect(()=> {
        getCookie();
    }, [])

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-2">
                    {/* Botão para adicionar um novo post */}
                    <button className="btn btn-primary mt-3 btn-block">Novo Post</button>
                </div>
                <div className="col-md-8">
                    {/* Campo principal para mostrar os posts dos usuários */}
                    <div className="card">
                        <div className="card-header">Posts dos Usuários</div>
                        <div className="card-body">
                            {/* Aqui você pode iterar sobre os posts dos usuários e exibi-los */}
                            <div className="post">
                                <h5 className="card-title">Título do Post</h5>
                                <p className="card-text">Conteúdo do Post</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;
