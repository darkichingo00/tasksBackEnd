import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateTask = [
    body("title").isString().notEmpty().withMessage("El título es obligatorio"),
    body("description").isString().notEmpty().withMessage("La descripción es obligatoria"),
    body("date").isISO8601().withMessage("La fecha debe estar en formato YYYY-MM-DD"),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    }
];
