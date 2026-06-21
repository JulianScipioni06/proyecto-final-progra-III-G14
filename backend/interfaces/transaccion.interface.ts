export interface InterfaceTransaccion {
    id_transaccion?: number, // el signo lo hace opcional (ya que se autoincrementa solo)
    monto: number,
    tipo: string,
    id_usuario: number;
    id_categoria: number;
    fecha?: Date 
}