import { ChangeEvent, useState, useContext } from 'react';
import '../../../public/style/main/newPost.css';
import { PostEntity } from '../../entities/posts/postEntity.entity';
import { GatewayContext } from '../../gateway/gatewayContext';
import Message from '../../components/visual/Message.component';

function NewPost() {
  const [post, setPost] = useState<PostEntity>(new PostEntity());
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [msg, setMsg] = useState({ msg: null, status: null });

  const gatewayContext = useContext(GatewayContext);
  const postsGateway = gatewayContext?.postsGateway;

  const handleOnImage = async (e: ChangeEvent<HTMLInputElement>) => {
    setMsg({ msg: null, status: null });

    const files = e.target.files;
    if (files) {
      const newImagePreviews: string[] = [];
      const newImages: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageURL = URL.createObjectURL(file);
        newImagePreviews.push(imageURL);
        newImages.push(file);
      }

      const totalImages = imagePreviews.length + newImagePreviews.length;

      if (totalImages > 3) {
        setMsg({ msg: "Só podem existir 3 imagens por postagem", status: 400 });
        return;
      }

      setImagePreviews((prevImagePreviews) => [...prevImagePreviews, ...newImagePreviews]);
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost((prevState) => new PostEntity({ ...prevState.props, [name]: value }));
  };

  const removeImage = (index: number) => {
    setImagePreviews((prevImagePreviews) => {
      const updatedPreviews = [...prevImagePreviews];
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });

    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  async function submit() {
    setMsg({ msg: null, status: null });
  
    const formData = new FormData();
    formData.append('title', post.title());
    formData.append('text', post.text());
    images.forEach((image) => {
      formData.append(`images`, image);
    });
    const response = await postsGateway?.save(formData);
  
    setMsg({ msg: response?.message, status: response?.status });
  
    if (response?.status < 300) {
      setTimeout(() => {
        window.location.href = "/home/index";
      }, 3000);
    }
  }
  

  return (
    <div className="modal">
      {msg.msg && <Message msg={msg.msg} status={msg.status} timers={3000} />}
      <div className="modal__header">
        <span className="modal__title">Nova Postagem</span>
      </div>
      <div className="modal__body">
        <div className="input-post">
          <label className="input__label" htmlFor="title">Título da Postagem</label>
          <input type="text" className="input__field" id="title" name="title" placeholder="Título" onChange={handleOnChange} />
        </div>
        <div className="input-post">
          <label className="input__label" htmlFor="description">Descrição</label>
          <textarea onChange={handleOnChange} rows="5" className="input__field input__field--textarea" id="description" name="text" placeholder='Dê uma boa descrição para sua postagem para que todos saibam do que se trata.'></textarea>
        </div>
        <div className="input-post">
          <div className="post_image">
            <input
              type="file"
              id="image_uploads"
              name="image_uploads"
              accept=".jpg, .jpeg, .png"
              multiple
              onChange={handleOnImage} />
            <div className="preview">
              {imagePreviews.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image} alt={`Image ${index}`} />
                  <button onClick={() => removeImage(index)}>Excluir</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="modal__footer button-post">
        <button className="btn btn btn-secondary" onClick={submit}>Salvar</button>
        <a href='/home/index'><button className="btn btn btn-danger">Cancelar</button></a>
      </div>
    </div>
  );
}

export default NewPost;
