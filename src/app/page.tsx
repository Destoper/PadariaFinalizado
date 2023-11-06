'use client'
import { useState, useEffect } from 'react'
import './globals.css'
import Image from 'next/image'
import logo from '../images/Logo.png'
import icon1 from '../images/Icon.png'
import icon2 from '../images/Group 1.png'
import icon3 from '../images/Group 2.png'
import trash from '../images/trash.svg'
import FormPedido from '@/components/FormPedido'

interface Pedido {
  id: number
  nome: string
  qtd_paes: number
}

interface requestPedido {
  nome: string
  qtd_paes: number
}

export default function Home() {
  const [data, setData] = useState<Pedido[]>([])
  const [queue, setQueue] = useState<number>(0)
  const [paes, setPaes] = useState<number>(0)
  const [faturamento, setFaturamento] = useState<number>(0.0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    //solicitação GET
    fetch('/api/pedidos', {
      method: 'GET',
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Falha na solicitação GET')
        }
      })
      .then((responseData) => {
        setData(responseData.data.data)
        setQueue(responseData.data.data.length)
        const paes = responseData.data.data.map((pedido: Pedido) => pedido.qtd_paes).reduce((a:number, b:number) => a + b, 0)
        setPaes(paes)
        setFaturamento(paes * 0.45)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const handleDelete = (id: number) => {
    // solicitação DELETE
    fetch('/api/pedidos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => {
        if (response.ok) {
          // Atualizar a lista de pedidos após a exclusão
          setData(data.filter((pedido: Pedido) => pedido.id !== id))
          setPaes(paes - data.filter((pedido: Pedido) => pedido.id === id)[0].qtd_paes)
          setQueue(queue - 1)
          setFaturamento(
            data.filter((pedido: Pedido) => pedido.id !== id).map((pedido: Pedido) => pedido.qtd_paes * 0.45).reduce((a, b) => a + b, 0)
          )
        } else {
          throw new Error('Falha na solicitação DELETE')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handlePost = (pedido: requestPedido) => {
    // solicitação POST
    const newPedido = {
      nome: pedido.nome,
      qtd_paes: pedido.qtd_paes,
    }

    fetch('/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPedido),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Falha na solicitação POST')
        }
      })
      .then((responseData) => {
        // Adicionar o novo pedido à lista de pedidos
        setData([...data, responseData.data])
        setFaturamento(faturamento + responseData.data.qtd_paes * 0.45)
        setPaes(paes + responseData.data.qtd_paes)
        setQueue(queue + 1)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <>
    <header>
      <Image className="logo" src={logo} alt="logo" />
      <div className="infos">
        <section className="tamfila">
          <a>
            <div>Pessoas na fila</div>
            <Image src={icon1} alt="icon1" />
          </a>
          <p>{queue}</p>
        </section>
        <section className="paesvend">
          <a>
            <div>Pães vendidos</div>
            <Image src={icon2} alt="icon2" />
          </a>
          <p>{paes}</p>
        </section>
        <section className="entrada">
          <a>
            <div>Entrada</div>
            <Image src={icon3} alt="icon3" />
          </a>
          <p>R$ {faturamento}</p>
        </section>
      </div>
    </header>
    <main>
      {isModalOpen && <FormPedido onClose={() => setIsModalOpen(false)} onAddPedido={handlePost} />}

      <div className="body-container">
        <p className="add" onClick={() => {setIsModalOpen(true)}}>
          + Adicionar Pedido
        </p>
        <div className="pedidos">
          {data.map((pedido: Pedido) => (
            <div style={{}} className='total-card'>
              <div className="card" key={pedido.id}>
                <p className="nome">{pedido.nome}</p>
                <div  className="desc-total">
                  <p className='desc'>
                    Total de pães: <span className="valor">{pedido.qtd_paes} pães</span>
                  </p>
                  <p className='desc'>
                    Total a pagar: <span className="valor">R$ {pedido.qtd_paes * 0.45}</span>
                  </p>
                </div>
              </div>
              <div className='delete-button'>
              <button onClick={() => handleDelete(pedido.id)}>
                <Image src={trash} alt="lixo" />
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
    <footer>
        <p>Com 💛 Info Jr UFBA 2022</p>
    </footer>
    </>
  )
}
