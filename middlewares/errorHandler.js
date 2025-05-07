// middlewares/errorHandler.js
export default function errorHandler(err, req, res, next) {
    console.error(err);

    res.status(err.status || 500).json({
        message: err.message || 'Erro interno',
        code: err.code || 'INTERNAL_ERROR',
        ...(err.details && { details: err.details })
    });
}

