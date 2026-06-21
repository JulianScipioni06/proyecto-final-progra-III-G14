export interface InterfaceUsuario {
    id_usuario?: number, // el signo lo hace opcional (ya que se autoincrementa solo)
    nombre: string,
    email: string,
    contrasena: string
}