import { BadRequestException } from '@nestjs/common';

 //valida que no se encuntre ninguna de esas palabras

const forbiddenPatterns = [
  /http[s]?:\/\//i, // enlaces http o https
  /select|insert|update|delete/i, // palabras clave SQL
  /\.(exe|bat|cmd|sh)$/i, // archivos ejecutables
];

// funcion que valida la longitud de campo

export function validateField(fieldName: string, fieldValue: string, maxLength: number = 255): void {
  if (fieldValue.length > maxLength) {
    throw new BadRequestException(`El campo ${fieldName} excede los ${maxLength} caracteres.`);
  }
// recorre cada uno y ve en que campo se encuentra el error
  forbiddenPatterns.forEach((pattern) => {
    if (pattern.test(fieldValue)) {
      throw new BadRequestException(`El campo ${fieldName} contiene un enlace o consulta no permitida.`);
    }
  });
}