import express from 'express';
import multer from 'multer';
import path from 'path'; // Biblioteca para trabalhar com extensões de arquivos
import { v4 as uuidv4 } from 'uuid';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import cors from 'cors';


const app = express();

// Configuração do multer para manter a extensão original
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Diretório onde os arquivos serão armazenados
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`; // Nome único com a extensão original
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Middleware para lidar com JSON no body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:3000', // Substitua pela URL do seu frontend
    methods: ['GET', 'POST'],
  })
);

async function openDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database,
  });
}

(async () => {
  const db = await openDb();

  // Criar a tabela se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      cpf TEXT NOT NULL,
      file TEXT NOT NULL,
      originalName TEXT NOT NULL,
      titular TEXT NOT NULL,
      tipo TEXT NOT NULL,
      dataEmissao TEXT NOT NULL,
      curso TEXT NOT NULL,
      instituicao TEXT NOT NULL
    );
  `);

  console.log('Tabela criada com sucesso.');
})();

// Rota de upload
app.post('/api/upload', upload.single('document'), async (req, res) => {
  const { cpf, titular, tipo, dataEmissao, curso, instituicao } = req.body;
  const file = req.file;
  const id = uuidv4();

  if (!cpf || !titular || !tipo || !dataEmissao || !curso || !instituicao || !file) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const db = await openDb();
    await db.run(
      `
      INSERT INTO documents (
        id, cpf, file, originalName, titular, tipo, dataEmissao, curso, instituicao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      id,
      cpf,
      file.filename, // Nome do arquivo com extensão preservada
      file.originalname, // Nome original do arquivo
      titular,
      tipo,
      dataEmissao,
      curso,
      instituicao
    );

    res.json({ message: 'Documento enviado com sucesso!', id });
  } catch (error) {
    console.error('Erro ao salvar o documento:', error);
    res.status(500).json({ message: 'Erro ao salvar o documento.' });
  }
});

// Rota de consulta
app.get('/api/search', async (req, res) => {
  const { cpf, key } = req.query;

  const db = await openDb();
  const document = await db.get(
    `SELECT * FROM documents WHERE cpf = ? AND id = ?`,
    cpf,
    key
  );

  if (document) {
    res.json({
      valid: true,
      data: {
        titular: document.titular,
        tipo: document.tipo,
        dataEmissao: document.dataEmissao,
        curso: document.curso,
        instituicao: document.instituicao,
        url: `http://localhost:3001/uploads/${document.file}`, // URL para baixar o arquivo
      },
    });
  } else {
    res.status(404).json({ valid: false, message: 'Documento não encontrado.' });
  }
});

// Servir arquivos enviados
app.use('/uploads', express.static('uploads'));

app.listen(3001, () => console.log('Backend rodando em http://localhost:3001'));
