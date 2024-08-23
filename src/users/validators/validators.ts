import { BadRequestException } from '@nestjs/common';

const forbiddenPatterns = [
  /http[s]?:\/\//i, // enlaces http o https
  /select|insert|update|delete/i, // palabras clave SQL
  /\.(exe|bat|cmd|sh)$/i, // archivos ejecutables
];

export function validateField(fieldName: string, fieldValue: string, maxLength: number = 255): void {
  if (fieldValue.length > maxLength) {
    throw new BadRequestException(`El campo ${fieldName} excede los ${maxLength} caracteres.`);
  }

  forbiddenPatterns.forEach((pattern) => {
    if (pattern.test(fieldValue)) {
      throw new BadRequestException(`El campo ${fieldName} contiene un enlace o consulta no permitida.`);
    }
  });
}