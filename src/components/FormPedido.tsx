import React, { useState } from 'react'
import './FormPedido.css'
import { PedidoRequest } from '../../pages/api/models/pedido'
type FormPedidoProps = {
  onClose: () => void
  onAddPedido: (pedido: PedidoRequest) => void
}

export default function FormPedido({ onClose, onAddPedido }: FormPedidoProps) {
  const [nome, setNome] = useState('')
  const [qtdPaes, setQtdPaes] = useState(0)

  const handlePost = () => {
    // Simulando uma solicitação POST
    const newPedido = {
      nome: nome,
      qtd_paes: qtdPaes,
    }

    // Chama a função onAddPedido passando o novo pedido
    onAddPedido(newPedido)

    // Fecha o formulário
    onClose()
  }

  return (
    <div>
      <div className="blurred-background"></div>
      <div className="form-container">
        <h2>Adicionar pessoa à fila</h2>
        <label>
          <input
            type="text"
            value={nome}
            placeholder="Nome completo do cliente"
            onChange={(e) => setNome(e.target.value)}
          />
        </label>
        <label>
          <input
            type="number"
            value={qtdPaes}
            min={0}
            placeholder="Total de pães"
            onChange={(e) => setQtdPaes(parseInt(e.target.value))}
          />
        </label>
        <div className="button-container">
          <button className="submit-button" onClick={handlePost}>
            Enviar
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
