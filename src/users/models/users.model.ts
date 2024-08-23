import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  correoElectronico: string;

  @Prop({ required: true })
  edad: number;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);