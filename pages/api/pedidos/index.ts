import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../config/prisma';
import { PedidoRequest, PedidoResponse, DeletePedidoRequest, GetPedidosResponse } from '../models/pedido';
import {ApiResponse} from '../models/response'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return handlePostRequest(req, res);
  } else if (req.method === 'DELETE') {
    return handleDeleteRequest(req, res);
  } else if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else {
    return res.status(404).json({
      error: 'Not Found',
    });
  }
}

async function handlePostRequest(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PedidoResponse>>
) {
  try {
    const { nome, qtd_paes } = req.body as PedidoRequest;

    if (!nome || typeof nome !== 'string' || nome.trim() === '' || !qtd_paes || typeof qtd_paes !== 'number' || qtd_paes < 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body',
      });
    }

    const pedido = await prisma.pedidos.create({
      data: {
        nome,
        qtd_paes,
      },
    });

    return res.status(201).json({
      success: true,
      data: pedido,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error creating pedido',
    });
  }
}


async function handleDeleteRequest(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PedidoResponse | null>>
) {
  try {
    const { id } = req.body as DeletePedidoRequest;

    if (!id || typeof id !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body',
      });
    }

    await prisma.pedidos.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete pedido',
    });
  }
}

async function handleGetRequest(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GetPedidosResponse>>
) {
  try {
    const pedidos: PedidoResponse[] = await prisma.pedidos.findMany();
    const pedidosCount = await prisma.pedidos.count();
    const response: GetPedidosResponse = {
      data: pedidos,
    };

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve pedidos',
    });
  }
}