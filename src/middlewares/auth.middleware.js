import jwt from 'jsonwebtoken';

// Verifica que la petición traiga un token válido -> el usuario está autenticado
export function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            mensaje: 'Debes iniciar sesión para realizar esta acción'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload; // { id, email, role }
        next();
    } catch (error) {
        return res.status(401).json({
            mensaje: 'Tu sesión no es válida o ha expirado, inicia sesión de nuevo'
        });
    }
}

// Debe usarse SIEMPRE después de verificarToken.
// Verifica que, además de estar logueado, el usuario tenga rol de administrador
export function verificarAdmin(req, res, next) {
    if (req.usuario?.role !== 'admin') {
        return res.status(403).json({
            mensaje: 'No tienes permisos de administrador para realizar esta acción'
        });
    }
    next();
}
