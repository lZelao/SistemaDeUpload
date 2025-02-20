import jwt from 'jsonwebtoken';

const JWT_SECRET = 'sua_chave_secreta'; // Use uma chave segura

// Middleware para verificar autenticação
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Ex: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado! Token ausente.' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET); // Decodifica e valida o token
    req.user = user; // Adiciona o usuário ao request (opcional)
    next(); // Permite continuar para a próxima middleware/rota
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido ou expirado!' });
  }
}
