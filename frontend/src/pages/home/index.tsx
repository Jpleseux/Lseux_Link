import { useContext, useEffect, useState } from "react";
import CookieFactory from "../../utils/cookieFactory";
import "../../../public/style/main/index.css"
import { GatewayContext } from "../../gateway/gatewayContext";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { MdGroup, MdOutlinePostAdd } from "react-icons/md";
import { PostEntity } from "../../entities/posts/postEntity.entity";

export type Avatar = {
    avatar: null;
    email: string;
    password: string;
    phone_number: string;
    token: string;
    userName: string;
}
function Index() {
    const factory = new CookieFactory();
    const [user, setUser] = useState({
        email: '',
        userName: '',
        avatar: '',
        phoneNumber: '',
        password: '',
      });
    const [posts, setPosts] = useState<PostEntity[]>();
    const gatewayContext = useContext(GatewayContext);
    const profileGateway = gatewayContext?.profileGateway;
    const postsGateway = gatewayContext?.postsGateway;
    async function getCookie(): Promise<Avatar> {
        return await factory.getCookie("user");
    }
    async function findUser() {
        const response = await profileGateway?.findUserByEmail();
        setUser({
            avatar: response.user.props.avatar ?? "",
            email: response.user.props.email ?? "",
            password: response.user.props.password,
            userName: response.user.props.userName,
            phoneNumber: response.user.props.phone_number ?? "",
        })
    }
    async function findPosts() {
        const res = await postsGateway?.findPostsCreatedToday();
        console.log(res?.posts[2].title());
        console.log(res?.posts[2].images().length)
        if (res?.posts && res.posts?.length > 0) {
            setPosts(res.posts)
        }
    }
    useEffect(()=> {
        findPosts();
        getCookie();
        findUser();
    }, [])

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-8 col-sm-offset-2">
                    <div className="panel panel profile-widget mt-4">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="image-container bg2" style={{background: "url(../../../public/imgs/backgroundProfile.jpg)", width: "100%"}}>
                                    <img src={user.avatar} className="avatar" alt="avatar" />
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="details">
                                    <h4>{user.userName}<i className="fa fa-sheild"></i></h4>
                                    <div>Email: {user.email}</div>
                                    <div className="m-4">
                                        <a href="/home/profile" className="m-2"><button> <MdGroup /> PERFIL </button></a>
                                        <a href="/home/new/post" ><button><MdOutlinePostAdd /> NOVA POSTAGEM </button></a>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-sm-12">
                        {posts && posts.length > 0 && 
                            posts.map((post, index) => (
                            <div className="panel panel-white post" key={index}>
                                <div className="post-heading">
                                    <div className="pull-left image">
                                        <img src={post.user()?.avatar()} className="img-circle avatar" alt="user profile image" />
                                    </div>
                                    <div className="pull-right meta">
                                        <div className="title">
                                            <b className="">{post.user()?.userName()}</b>
                                            Fez uma nova postagem
                                        </div>
                                        <h6 className="text-muted time">5 segundos atrás</h6>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="post-image">
                                    <img src={post.images()} className="image" alt="image post" />
                                </div>
                                <div className="post-description">
                                    <h4>{post.title()}</h4>
                                    <p>{post.text()}</p>
                                    <div className="stats">
                                        <a href="javascript:void(0);" className="btn btn-default stat-item">
                                            <AiFillLike />{post.like()}
                                        </a>
                                        <a href="javascript:void(0);" className="btn btn-default stat-item">
                                            <AiFillDislike />{post.desLike()}
                                        </a>
                                    </div>
                                </div>
                                <div className="post-footer">
                                    <div className="input-group">
                                        <input className="form-control" placeholder="Add a comment" type="text" />
                                        <span className="input-group-addon">
                                            <a href="javascript:void(0);"><i className="fa fa-edit"></i></a>
                                        </span>
                                    </div>
                                    <ul className="comments-list">
                                    </ul>
                                </div>
                            </div>
                            ))
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;
