import React, { useEffect, useState, useCallback } from 'react';

import { FiEdit, FiDelete } from 'react-icons/fi';
import { Container, TableContainer, TableButton } from './styles';
import Category from '../Category';

import Header from '../../components/Header';
import Button from '../../components/Button';
import api from '../../services/api';

interface Sku {
  id: string;
  name: string;
  code: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Data {
  seccuss: boolean;
  data: {
    skus: Sku[];
    page: number;
    total: number;
  };
}

const Dashboard: React.FC = () => {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [modalIsOpen, setModelIsOpen] = useState<boolean>(false);

  useEffect(() => {
    api.get<Data>('/skus').then(response => {
      setSkus(response.data.data.skus);
    });
  }, [skus]);

  const handleOpenModal = useCallback(() => {
    setModelIsOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModelIsOpen(false);
  }, []);

  return (
    <>
      <Container>
        <Header />

        <TableButton>
          <Button type="button" onClick={() => handleOpenModal()}>
            Adicionar Categorias
          </Button>
          <Button type="button">Adicionar Produtos</Button>
          <Button type="button">Adicionar Variações de produto</Button>
        </TableButton>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Nome do produto</th>
                <th>SKU</th>
                <th>Quantidade</th>
                <th>Preço</th>
                <th />
                <th>Opções</th>
              </tr>
            </thead>
            <tbody>
              {skus.map(sku => (
                <tr key={sku.id}>
                  <td>{sku.product.name}</td>
                  <td>{sku.code}</td>
                  <td>{sku.quantity}</td>
                  <td>{sku.price}</td>
                  <td>
                    <button type="button">
                      <FiEdit />
                    </button>
                  </td>
                  <td>
                    <button type="button">
                      <FiDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
      <Category isOpen={modalIsOpen} handleClick={handleCloseModal} />
    </>
  );
};

export default Dashboard;
