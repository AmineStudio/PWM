export interface Restaurante {
  id: string;
  nombre: string;
  tipo: string;
  ciudad: string;
  descripcion: string;
  imagen: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  nombre: string;
  apellidos: string;
  fotoUrl: string;
}