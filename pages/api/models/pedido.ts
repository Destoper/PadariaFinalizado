export type PedidoRequest = {
    nome: string;
    qtd_paes: number;
};

export type PedidoResponse = {
    id: number;
    nome: string;
    qtd_paes: number;
};

export type DeletePedidoRequest = {
    id: number;
};

export type GetPedidosResponse = {
    data: PedidoResponse[];
};