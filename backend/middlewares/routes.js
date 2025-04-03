import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "Требуется авторизация (Поле запроса authorization отсутствует)" });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Неверный формат токена (Не забудь Bearer в запросе)" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({ message: "Токен истек" });
        return res.status(401).json({ message: "Неверный токен" });
    }
};