"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Definir a tipagem para as informações do documento
interface InformacoesDocumento {
  titular: string;
  tipo: string;
  dataEmissao: string;
  curso: string;
  instituicao: string;
  url?: string;
}

const Resultado = () => {
  const searchParams = useSearchParams();
  const [informacoesDocumento, setInformacoesDocumento] = useState<InformacoesDocumento | null>(null);

  useEffect(() => {
    // Obter os dados da query string
    const data = searchParams.get("data");

    if (data) {
      try {
        // Decodificar e converter os dados em JSON
        const documentoData = JSON.parse(decodeURIComponent(data));
        setInformacoesDocumento(documentoData);
      } catch (error) {
        console.error("Erro ao parsear os dados:", error);
      }
    }
  }, [searchParams]);

  if (!informacoesDocumento) {
    return (
      <p
        style={{
          padding: "10px",
          backgroundColor: "#ffebee",
          color: "#c62828",
          fontWeight: "bold",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        Nenhuma informação disponível.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "90%",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h1 style={{ color: "#3474b4", marginBottom: "20px" }}>Resultado da Consulta</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <p>
            <strong>Titular:</strong> {informacoesDocumento.titular}
          </p>
          <p>
            <strong>Tipo:</strong> {informacoesDocumento.tipo}
          </p>
          <p>
            <strong>Data de Emissão:</strong> {informacoesDocumento.dataEmissao}
          </p>
          <p>
            <strong>Curso:</strong> {informacoesDocumento.curso}
          </p>
          <p>
            <strong>Instituição:</strong> {informacoesDocumento.instituicao}
          </p>
        </div>

        {informacoesDocumento?.url && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <a
              href={informacoesDocumento.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "15px 30px",
                backgroundColor: "#3474b4",
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
                borderRadius: "5px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              Download do Documento
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ResultadoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Resultado />
    </Suspense>
  );
}
