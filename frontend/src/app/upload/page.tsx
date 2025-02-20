"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Upload = () => {
  const router = useRouter();

  const [cpf, setCpf] = useState("");
  const [titular, setTitular] = useState("");
  const [tipo, setTipo] = useState("");
  const [dataEmissao, setDataEmissao] = useState("");
  const [curso, setCurso] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [generatedId, setGeneratedId] = useState("");

  // Proteção de rota: Verificar autenticação
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/"); // Redireciona para login se não estiver autenticado
    }
  }, [router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cpf", cpf);
    formData.append("titular", titular);
    formData.append("tipo", tipo);
    formData.append("dataEmissao", dataEmissao);
    formData.append("curso", curso);
    formData.append("instituicao", instituicao);

    if (document) {
      formData.append("document", document);
    }

    try {
      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Documento enviado com sucesso!");
        setGeneratedId(data.id);
      } else {
        setMessage(data.message || "Erro ao enviar o documento.");
      }
    } catch (error) {
      setMessage("Erro ao conectar ao servidor.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#3474b4", marginBottom: "20px" }}>
        Upload de Documentos
      </h1>
      <form
        onSubmit={handleUpload}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#3474b4",
            }}
          >
            CPF:
          </label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#3474b4",
            }}
          >
            Titular:
          </label>
          <input
            type="text"
            value={titular}
            onChange={(e) => setTitular(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#3474b4",
            }}
          >
            Tipo:
          </label>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#3474b4",
            }}
          >
            Data de Emissão:
          </label>
          <input
            type="date"
            value={dataEmissao}
            onChange={(e) => setDataEmissao(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#3474b4",
            }}
          >
            Curso:
          </label>
          <input
            type="text"
            value={curso}
            onChange={(e) => setCurso(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#3474b4",
            }}
          >
            Instituição:
          </label>
          <input
            type="text"
            value={instituicao}
            onChange={(e) => setInstituicao(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#3474b4",
            }}
          >
            Documento:
          </label>
          <input
            type="file"
            onChange={(e) => setDocument(e.target.files ? e.target.files[0] : null)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#3474b4",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Enviar
        </button>
      </form>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px",
          marginTop: "20px",
          backgroundColor: "#c62828",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sair
      </button>
      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: generatedId ? "#e8f5e9" : "#ffebee",
            color: generatedId ? "#2e7d32" : "#c62828",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          <p>{message}</p>
          {generatedId && <p><strong>ID Gerado:</strong> {generatedId}</p>}
        </div>
      )}
    </div>
  );
};

export default Upload;
