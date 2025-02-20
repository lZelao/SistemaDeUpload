"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../app/globals.css"; // Importe o CSS global

// Definindo a interface para o estado 'informacoesDocumento'
interface InformacoesDocumento {
  titular?: string;
  tipo?: string;
  dataEmissao?: string;
  curso?: string;
  instituicao?: string;
}

const Search = () => {
  const [documento, setDocumento] = useState("");
  const [chave, setChave] = useState("");
  const [informacoesDocumento, setInformacoesDocumento] = useState<InformacoesDocumento | null>(null);
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleConsultar = async () => {
    try {
      // Fazendo a requisição para a API
      const response = await fetch(
        `http://147.93.70.3:3001/api/search?cpf=${documento}&key=${chave}`
      );

      const data = await response.json();
      console.log("Resposta da API:", data); // Debug da resposta da API

      if (response.ok) {
        // Certifique-se de que os dados são válidos e que a resposta é uma string para URL
        const result = encodeURIComponent(JSON.stringify(data.data));

        // Redireciona para a página de resultado com os dados
        router.push(`/resultado?data=${result}`);

        setErro(""); // Limpa mensagens de erro
      } else {
        setInformacoesDocumento(null);
        setErro(data.message || "Erro ao consultar o documento.");
      }
    } catch (error) {
      console.error("Erro ao consultar:", error); // Debug do erro
      setInformacoesDocumento(null);
      setErro("Erro de conexão com o servidor.");
    }
  };

  const handleLimpar = () => {
    setDocumento("");
    setChave("");
    setInformacoesDocumento(null);
    setErro("");
  };

  return (
    <div id="content">
      <form
        id="form-consultar-certificado-digital"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h3 className="panel-title text-center">
              <i className="fa fa-search"></i>
              Validação de Documento Digital
            </h3>
          </div>

          <div className="row item-center">
            <div className="col-xs-8 col-sm-4">
              <div className="form-group">
                <label htmlFor="docRegistro">* Documento de Registro</label>
                <input
                  type="text"
                  name="docRegistro"
                  id="docRegistro"
                  className="form-control"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  placeholder="CPF ou Documento Estrangeiro"
                />
              </div>
            </div>
          </div>

          <div className="row item-center">
            <div className="col-xs-8 col-sm-4">
              <div className="form-group">
                <label htmlFor="chave">* CHAVE:</label>
                <input
                  type="text"
                  name="chave"
                  id="chave"
                  className="form-control"
                  value={chave}
                  onChange={(e) => setChave(e.target.value)}
                  placeholder="Chave"
                />
              </div>
            </div>
          </div>

          <div className="row item-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConsultar}
            >
              <i className="fa fa-search"></i> Validar
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLimpar}
            >
              Limpar
            </button>
          </div>

          {erro && <p style={{ color: "red", marginTop: "10px" }}>{erro}</p>}

          {informacoesDocumento && (
            <div className="panel panel-default" id="painel-informacoes-documento">
              <div className="panel-body">
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <div className="form-group">
                      <label>
                        <b>Titular do Documento:</b>
                      </label>
                      <p className="form-control-static">
                        {informacoesDocumento.titular || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-6">
                    <div className="form-group">
                      <label>
                        <b>Tipo:</b>
                      </label>
                      <p className="form-control-static">
                        {informacoesDocumento.tipo || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-6">
                    <div className="form-group">
                      <label>
                        <b>Data de Emissão:</b>
                      </label>
                      <p className="form-control-static">
                        {informacoesDocumento.dataEmissao || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-6">
                    <div className="form-group">
                      <label>
                        <b>Curso:</b>
                      </label>
                      <p className="form-control-static">
                        {informacoesDocumento.curso || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-6">
                    <div className="form-group">
                      <label>
                        <b>Instituição Responsável:</b>
                      </label>
                      <p className="form-control-static">
                        {informacoesDocumento.instituicao || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Search;
