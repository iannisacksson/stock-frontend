import React, { useEffect, useState, useCallback, useRef } from 'react';

import { FiEdit, FiDelete, FiEye } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Container, TableContainer, TableButton } from './styles';
import AddProduct from '../AddProduct';
import UpdateProduct from '../UpdateProduct';
import OrderSku from '../OrderSku';

import { useToast } from '../../hooks/toast';

import Header from '../../components/Header';
import Button from '../../components/Button';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErros';

interface Product {
  id: string;
  name: string;
  identifier_code: string;
}

const Product: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [addProductIsOpen, setProductIsOpen] = useState<boolean>(false);
  const [orderSkuIsOpen, setOrderSkuIsOpen] = useState<boolean>(false);
  const [updateProductIsOpen, setUpdateProductOpen] = useState<boolean>(false);
  const [updateProduct, setUpdateProduct] = useState<Product>({} as Product);
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    api.get('/products').then(response => {
      setProducts(response.data.data.products);
    });
  }, [setProductIsOpen]);

  const handleOpenProduct = useCallback(() => {
    setProductIsOpen(!addProductIsOpen);
  }, [addProductIsOpen]);

  const handleOpenOrderSku = useCallback(() => {
    setOrderSkuIsOpen(!orderSkuIsOpen);
  }, [orderSkuIsOpen]);

  const handleOpenUpdateProduct = useCallback(() => {
    setUpdateProductOpen(!updateProductIsOpen);
  }, [updateProductIsOpen]);

  const handleUpdateProduct = useCallback(
    (product: Product) => {
      handleOpenUpdateProduct();
      setUpdateProduct(product);
    },
    [handleOpenUpdateProduct],
  );

  const handleCloseClick = useCallback(
    (product: Product) => {
      handleOpenProduct();

      setProducts([product, ...products]);
    },
    [handleOpenProduct, products],
  );

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/products/${id}`);
        const updateProducts = products.filter(product => product.id !== id);

        setProducts(updateProducts);

        addToast({
          type: 'success',
          title: 'Produto excluído com sucesso',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao delete o produto',
        });
      }
    },
    [products, addToast],
  );

  const handleUpdateProductState = useCallback(
    async (product: Product) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          identifier_code: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(product, {
          abortEarly: false,
        });

        await api.put(`/products/${updateProduct.id}`, product);

        const productIndex = products.findIndex(
          productFind => productFind.id === updateProduct.id,
        );

        products[productIndex].identifier_code = product.identifier_code;
        products[productIndex].name = product.name;

        setProducts(products);

        addToast({
          type: 'success',
          title: 'Variação de categoria cadastrado',
        });

        handleOpenUpdateProduct();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao adicionar variação de categoria',
        });
      }
    },
    [handleOpenUpdateProduct, addToast, updateProduct.id, products],
  );

  return (
    <>
      <Container>
        <Header />

        <TableButton>
          <Button type="button" onClick={() => handleOpenProduct()}>
            Adicionar Produto
          </Button>
          <Button type="button" onClick={() => handleOpenOrderSku()}>
            Montar ordem de prioridade da SKU
          </Button>
        </TableButton>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Nome do produto</th>
                <th>Código Identificador</th>
                <th />
                <th />
                <th>Opções</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.identifier_code}</td>
                  <td>
                    <button type="button">
                      <FiEye />
                    </button>
                  </td>
                  <td>
                    <button type="button">
                      <FiEdit onClick={() => handleUpdateProduct(product)} />
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <FiDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
      <AddProduct
        isOpen={addProductIsOpen}
        handleClick={handleOpenProduct}
        handleCloseClick={handleCloseClick}
      />
      <UpdateProduct
        isOpen={updateProductIsOpen}
        handleClick={handleOpenUpdateProduct}
        editProduct={updateProduct}
        handleUpdateProductState={handleUpdateProductState}
      />
      <OrderSku isOpen={orderSkuIsOpen} handleClick={handleOpenOrderSku} />
    </>
  );
};

export default Product;
