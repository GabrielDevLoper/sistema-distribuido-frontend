import React from 'react';
import './App.css';

export default function Dashboard({history}){

function Face(){
  history.push('/face');
}

function CadastroCliente(){
  history.push('/form');
}

function ListarCliente(){
  history.push('/list-user');
}

  return (
      <div className="containerDash">
        <div className="contentDash">
          <button type="submit" className="btnEnviar" onClick={() => CadastroCliente()}>Cadastrar Cliente</button>
          <button type="submit" className="btnEnviar" onClick={() => ListarCliente()}>Listar Clientes</button>
          <button type="submit" className="btnEnviar" onClick={() => Face()}>Reconhecimento Facial</button>
        </div>
      </div>

  );
}