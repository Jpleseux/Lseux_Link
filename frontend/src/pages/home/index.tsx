import { ChangeEvent, useContext, useEffect, useState } from "react";
import CookieFactory from "../../utils/cookieFactory";
import "../../../public/style/main/index.css"
import { GatewayContext } from "../../gateway/gatewayContext";
import { MdGroup, MdOutlinePostAdd } from "react-icons/md";
import { PostEntity } from "../../entities/posts/postEntity.entity";
import ReactLoading from 'react-loading';
import PostComponent from "../../components/posts/posts";


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
    const [user, setUser] = useState<Avatar>({
        email: '',
        uuid: '',
        userName: '',
        avatar: '',
        phoneNumber: '',
        password: '',
    });
    const [posts, setPosts] = useState<PostEntity[]>();
    const [loading, setLoading] = useState(false);
    const gatewayContext = useContext(GatewayContext);
    const profileGateway = gatewayContext?.profileGateway;
    const postsGateway = gatewayContext?.postsGateway;
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    async function getCookie(): Promise<Avatar> {
        return await factory.getCookie("user");
    }
    async function findUser() {
        setLoading(true);
        const response = await profileGateway?.findUserByEmail();
        setUser({
            uuid: response?.user?.props.uuid ?? "",
            avatar: response.user.props.avatar ?? "",
            email: response.user.props.email ?? "",
            password: response.user.props.password,
            userName: response.user.props.userName,
            phoneNumber: response.user.props.phone_number ?? "",
        })
    }
    async function findPosts() {
        const res = await postsGateway?.findPostsCreatedToday();
        if (res?.posts && res.posts?.length > 0) {
            setPosts(res.posts)
        }
        setLoading(false)
    }
    useEffect(()=> {
        findPosts();
        getCookie();
        findUser();
    }, [])
    function handleCloseFullscreenImage() {
        setFullscreenImage(null);
    }
    function handleImageClick(imageUrl: string) {
        setFullscreenImage(imageUrl);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-18 col-sm-offset-4">
                    <div className="panel panel profile-widget mt-4">
                        {!loading &&
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="image-container bg2" style={{background: "url(../../../public/imgs/backgroundProfile.jpg)", width: "100%"}}>
                                        <img src={user.avatar} className="avatar" alt="avatar" onClick={() => handleImageClick(user.avatar)} style={{maxWidth: '100%', maxHeight: '100%', display: 'block'}}/>
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
                        }
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                        {!loading && posts && posts.length > 0 &&
                            posts.map((post, index) => (
                                <PostComponent  key={index} post={post} user={user}/>
                            ))
                        }
                        {loading && 
                            <div className="col-sm-12 d-flex justify-content-center align-items-center m-4">
                                <ReactLoading type="spin" height={"20%"} width={ "30%" } className=""/>
                            </div>
                        }
                        </div>
                    </div>
                </div>
                {fullscreenImage && (
                    <div className="fullscreen-image-overlay" onClick={handleCloseFullscreenImage}>
                        <img src={fullscreenImage} className="fullscreen-image" alt="Fullscreen" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Index;
