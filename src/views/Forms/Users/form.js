import React, {useState, useMemo} from 'react';
import api from '../../../services/api';
import camera from '../../../assets/camera.svg';
import './App.css';

export default function Formulario({ history }){
    const [image, setImage] =useState(null);
    const [name, setName] = useState('');
    
    const preview = useMemo(() => {
        return image ? URL.createObjectURL(image) : null;
    }, [image])
  
    async function handleSubmit(event){
        event.preventDefault();
        const data = new FormData();
        data.append('myfile_index', image);
        data.append('name', name);
       
        const response = await api.post('/users', data);
        const {_id} = response.data;
        console.log(_id);
        
        alert("Usuario cadastrado com sucesso");
        history.push('/');
    }

    
    return (
        <div className="container">
            <div className="content">
            <form onSubmit={handleSubmit} >

                <label id="image" style={{backgroundImage:`url(${preview})`}}  >
                    <input 
                    type="file"
                    id="myfile_index" 
                    onChange={event => setImage(event.target.files[0])}
                    />
                    {/* eslint-disable-next-line*/}
                    <img src={camera} alt="Selecione a Image"/>
                </label>

                <label htmlFor="nome">Nome:</label>
                <input 
                type="text"
                id="nome"
                placeholder="Seu Nome"
                value={name}
                onChange={event => setName(event.target.value)}
                />

                <button type="submit" className="btnEnviar">Enviar</button>
                                   
            </form>
            </div>
        </div>
        
    )
}