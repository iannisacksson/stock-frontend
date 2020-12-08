import React, { useEffect, useState, useCallback } from 'react';

import { FiEdit, FiDelete } from 'react-icons/fi';
import { Container, TableContainer, TableButton } from './styles';
import Category from '../Category';
import Variant from '../Variant';

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

const Dashboard: React.FC = () => {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [categoryIsOpen, setCategoryIsOpen] = useState<boolean>(false);
  const [variantIsOpen, setVariantIsOpen] = useState<boolean>(false);

  useEffect(() => {
    api.get('/skus').then(response => {
      setSkus(response.data.data.skus);
    });
  }, []);

  const handleOpenCategory = useCallback(() => {
    setCategoryIsOpen(true);
  }, []);

  const handleCloseCategory = useCallback(() => {
    setCategoryIsOpen(false);
  }, []);

  const handleOpenVariant = useCallback(() => {
    setVariantIsOpen(true);
  }, []);

  const handleCloseVariant = useCallback(() => {
    setVariantIsOpen(false);
  }, []);

  return (
    <>
      <Container>
        <Header />

        <TableButton>
          <Button type="button" onClick={() => handleOpenCategory()}>
            Adicionar Categorias
          </Button>
          <Button type="button" onClick={() => handleOpenVariant()}>
            Adicionar Variações
          </Button>
          <Button type="button">Adicionar Variações de produto</Button>
          <Button type="button">Adicionar Variações de produto</Button>
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
      <Category isOpen={categoryIsOpen} handleClick={handleCloseCategory} />
      <Variant isOpen={variantIsOpen} handleClick={handleCloseVariant} />
    </>
  );
};

export default Dashboard;
