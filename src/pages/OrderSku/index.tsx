import React, { useRef, useCallback, useState, useEffect } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { CustomStyles } from './styles';
import { useToast } from '../../hooks/toast';

import api from '../../services/api';
import Button from '../../components/Button';
import Select from '../../components/Select';

interface ProductFormData {
  product_id: string;
  categoryOne: string;
  categoryTwo: string;
  categoryThree: string;
}

interface Product {
  id: string;
  name: string;
  identifier_code: string;
}

interface Categories {
  id: string;
  name: string;
}

interface ProductProps {
  isOpen: boolean;
  handleClick: () => void;
}

interface ProductOptions {
  value: string;
  label: string;
}

interface CategoriesOptions {
  value: string;
  label: string;
}

interface OrderSku {
  product_id: string;
  categories: {
    variant_category_id: string;
    priority: string;
  }[];
}

const OrderSku: React.FC<ProductProps> = ({ isOpen, handleClick }) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const [products, setProducts] = useState<ProductOptions[]>([]);
  const [categories, setCategories] = useState<CategoriesOptions[]>([]);

  const handleSubmit = useCallback(
    async (data: ProductFormData) => {
      try {
        const orderSku: OrderSku = {
          product_id: data.product_id,
          categories: [],
        };

        if (data.categoryOne.length > 0) {
          orderSku.categories.push({
            variant_category_id: data.categoryOne,
            priority: '1',
          });
        }

        if (data.categoryTwo.length > 0) {
          orderSku.categories.push({
            variant_category_id: data.categoryTwo,
            priority: '2',
          });
        }
        if (data.categoryThree.length > 0) {
          orderSku.categories.push({
            variant_category_id: data.categoryThree,
            priority: '3',
          });
        }

        await api.post('/order-skus', orderSku);

        addToast({
          type: 'success',
          title: 'Variação de categoria cadastrado',
        });

        handleClick();
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao adicionar variação de categoria',
        });
      }
    },
    [addToast, handleClick],
  );

  useEffect(() => {
    api
      .get('/products', {
        params: {
          limit: 50,
          page: 1,
        },
      })
      .then(response => {
        const productsResponse = response.data.data.products.map(
          (product: Product) => {
            return { value: product.id, label: product.name };
          },
        );

        setProducts(productsResponse);
      });
  }, []);

  useEffect(() => {
    api
      .get('/variant-categories', {
        params: {
          limit: 50,
          page: 1,
        },
      })
      .then(response => {
        const categoriesResponse = response.data.data.variantCategories.map(
          (category: Categories) => {
            return { value: category.id, label: category.name };
          },
        );

        setCategories(categoriesResponse);
      });
  }, []);

  return (
    <>
      <CustomStyles
        isOpen={isOpen}
        onRequestClose={handleClick}
        contentLabel="Example Modal"
      >
        <h2>Montar ordem de prioridade da SKU</h2>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Select options={products} name="product_id" placeholder="Produtos" />

          <Select
            options={categories}
            name="categoryOne"
            placeholder="Prioridade 1"
          />
          <Select
            options={categories}
            name="categoryTwo"
            placeholder="Prioridade 2"
          />
          <Select
            options={categories}
            name="categoryThree"
            placeholder="Prioridade 3"
          />

          <Button type="submit">Adicionar</Button>
        </Form>
      </CustomStyles>
    </>
  );
};

export default OrderSku;
