import { PostEntity } from "../../entities/posts/postEntity.entity";
import { SaveCommentInput } from "../../gateway/interfaces/posts/postsGateway.interface";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { IoAddCircleSharp } from "react-icons/io5";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import "../../../public/style/main/index.css"
import Message from "../../components/visual/Message.component";
import ReactLoading from 'react-loading';
import { GatewayContext } from "../../gateway/gatewayContext";
import { UserEntity } from "../../entities/auth/User.entity";


function PostComponent({ post, user }: { post: PostEntity, user: UserEntity }) {
const [comment, setComment] = useState("");
const [wordCount, setWordCount] = useState(0);
const [commentsToShow, setCommentsToShow] = useState(3);
const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
const [likeClickCount, setLikeClickCount] = useState(0);
const [dislikeClickCount, setDislikeClickCount] = useState(0);
const [msg, setMsg] = useState({ msg: null, status: null });
const [msgKey, setMsgKey] = useState(0);
const [loading, setLoading] = useState(false);
const [postState, setPost] = useState<PostEntity>();

const gatewayContext = useContext(GatewayContext);
const postsGateway = gatewayContext?.postsGateway;

function countWords(text: string) {
    const words = text.trim().split(/\s+/);
    return words.filter(word => word !== '').length;
}
const handleShowMoreComments = () => {
    setCommentsToShow(prev => prev + 3);
};
const handleShowLessComments = () => {
    setCommentsToShow(prev => prev - 3);
};
async function sendComment(postUuid: string) {
    setMsg({msg: null, status: null});
    if (wordCount >50 || comment.length > 200) {
        setMsg({ msg: "O comentário não pode ter mais de 50 palavras ou 200 caracteres", status: 400 });
    } else {
        const input: SaveCommentInput = {
            comment: comment,
            posterUuid: postUuid,
        }
        const response = await postsGateway?.saveComment(input);
        if (postState.uuid() === response?.comment?.posterUuid()) {
            postState.comments().unshift(response.comment);
            setPost(postState);
        }
        setComment("");
        setWordCount(0);
        setMsg({ msg: response?.message, status: response?.status });
    }
}

function onChangeComment(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {
    const { value } = e.target;
    setComment(value);
    setWordCount(countWords(value));
}
async function setReaction(userUuid: string, type: string, uuid: string) {
    setMsg({msg: null, status: null});
    if (type === "like") {
        await handleLike(userUuid);
    } else if (type === "desLike") {
        await handleDislike(userUuid);
    }
    const response = await postsGateway?.setNewReaction({type: type, uuid: uuid});
    if (response?.status > 300) {
        setMsg({ msg: response?.message, status: response?.status });
    }
}
function handleLike(userUuid: string) {
    if (likeClickCount < 4) {
        post.addLike(userUuid); // Atualiza o estado do post diretamente
        setLikeClickCount(prevCount => prevCount + 1);
        setPost(new PostEntity(post)); // Atualiza o estado do post
    } else {
        setMsg({msg: null, status: null});
        setMsg({msg: "Você clicou muitas vezes em pouco tempo", status: 400});
        setMsgKey(prevKey => prevKey + 1);
    }
}

function handleDislike(userUuid: string) {
    if (dislikeClickCount < 4) {
        post.addDesLike(userUuid); // Atualiza o estado do post diretamente
        setDislikeClickCount(prevCount => prevCount + 1);
        setPost(new PostEntity(post)); // Atualiza o estado do post
    } else {
        setMsg({msg: null, status: null});
        setMsg({msg: "Você clicou muitas vezes em pouco tempo", status: 400});
        setMsgKey(prevKey => prevKey + 1);
    }
}

function handleCloseFullscreenImage() {
    setFullscreenImage(null);
}
function handleImageClick(imageUrl: string) {
    setFullscreenImage(imageUrl);
}
useEffect(() => {
    setPost(post);
}, [])
useEffect(() => {
    let likeTimer: NodeJS.Timeout;
    let dislikeTimer: NodeJS.Timeout;

    if (likeClickCount >= 4) {
        likeTimer = setTimeout(() => {
            setLikeClickCount(0);
        }, 10000);
    }
    if (dislikeClickCount >= 4) {
        dislikeTimer = setTimeout(() => {
            setDislikeClickCount(0);
        }, 10000);
    }
    return () => {
        clearTimeout(likeTimer);
        clearTimeout(dislikeTimer);
    };
}, [likeClickCount, dislikeClickCount]);
    return (
        <div className="panel panel-white post">
        <Message key={msgKey} msg={msg.msg} status={msg.status} timers={3000} />

            <div className="post-heading">
                <div className="pull-left image">
                    <img src={post.user()?.avatar()} className="img-circle avatar" alt="user profile image" />
                </div>
                <div className="pull-right meta">
                    <div className="title">
                        <b className="">{post.user()?.userName()}</b>
                        Fez uma nova postagem
                    </div>
                    <h6 className="text-muted time">
                        {`Postado em ${
                            ("0" + post.createdAt()?.getDate()).slice(-2)
                        }/${
                            ("0" + (post.createdAt()?.getMonth() + 1)).slice(-2)
                        }/${post.createdAt()?.getFullYear()} às ${
                            ("0" + post.createdAt()?.getHours()).slice(-2)
                        }:${
                            ("0" + post.createdAt()?.getMinutes()).slice(-2)
                        }`}
                    </h6>
                </div>
                <div className="clearfix"></div>
            </div>
            <div className="post-image-container">
            {post.images().length > 0 &&
                post.images().map((img, index)=> (
                <div className="post-image" key={index}>
                    <img src={img} className="image" alt={`image-post-${index}`} onClick={() => handleImageClick(img)} />
                </div>
                ))
            }
            </div>
            <div className="post-description">
                <h4>{post.title()}</h4>
                <ReactReadMoreReadLess
                    charLimit={200}
                    readMoreText={"Ler Mais ▼"}
                    readLessText={"Ler Menos ▲"}
                >
                    {post.text()}
                </ReactReadMoreReadLess>
                <div className="stats">
                <button className="btn btn-default stat-item" onClick={() => setReaction(user.uuid, "like", post.uuid())}>
                    <AiFillLike />{post.like()?.amount}
                </button>
                <button className="btn btn-default stat-item" onClick={() => setReaction(user.uuid, "desLike", post.uuid())}>
                    <AiFillDislike />{post.desLike()?.amount}
                </button>
                </div>
            </div>
            <div className="post-footer">
                <div style={{ color: 'gray', fontSize: '14px' }}>{wordCount} Palavra(s)</div>
                <div className="input-group">
                    <input className="form-control" placeholder="Adicionar comentário" type="text" onChange={onChangeComment} value={comment}/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => sendComment(post.uuid())}>
                            <IoAddCircleSharp />
                        </button>
                    </div>
                </div>
                <ul className="comments-list">
                    {!loading &&
                        <div>
                            {post.comments() && post.comments().length > 0 &&
                                post.comments().slice(0, commentsToShow).map((comment, index) => (
                                    <li className="comment" key={index}>
                                        <a className="pull-left" href="#">
                                            <img className="avatar" src={comment.user().props.avatar} alt="avatar" />
                                        </a>
                                        <div className="comment-body">
                                            <div className="comment-heading">
                                                <h4 className="user">{comment.user().props.userName}</h4>
                                                <h5 className="time">                                            
                                                    {`${
                                                        ("0" + comment.createdAt().getDate()).slice(-2)
                                                    }/${
                                                        ("0" + (comment.createdAt()?.getMonth() + 1)).slice(-2)
                                                    }/${comment.createdAt()?.getFullYear()} às ${
                                                        ("0" + comment.createdAt()?.getHours()).slice(-2)
                                                    }:${
                                                        ("0" + comment.createdAt()?.getMinutes()).slice(-2)
                                                    }`
                                                    }
                                                </h5>
                                            </div>
                                            <h6>{comment.comment()}</h6>
                                        </div>
                                    </li> 
                                ))
                            }
                        </div>
                    }
                    {loading &&
                        <div className="col-sm-12 d-flex justify-content-center align-items-center m-4">
                            <ReactLoading type="spin" height={"20%"} width={ "30%" } className=""/>
                        </div>
                    }
                </ul>

                {post.comments() && post.comments().length >= commentsToShow && (
                    <>
                    <button className="btn btn-link" onClick={handleShowMoreComments}>
                        Ler Mais ▼
                    </button>
                    </>
                )}
                {commentsToShow > 3 &&
                        <button className="btn btn-link" onClick={handleShowLessComments}>
                            Ler Menos ▲
                        </button>
                }
            </div>
            {fullscreenImage && (
                <div className="fullscreen-image-overlay" onClick={handleCloseFullscreenImage}>
                    <img src={fullscreenImage} className="fullscreen-image" alt="Fullscreen" />
                </div>
            )}
        </div>
    )
}
export default PostComponent;