import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useHistory } from 'react-router-dom';
import { CustomStyles } from './styles';
import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';
import Select from '../../components/Select';

interface ProductFormData {
  price: number;
  quantity: number;
  categoryOne: string;
  categoryTwo: string;
  categoryThree: string;
}

interface Product {
  id: string;
  name: string;
  identifier_code: string;
}

interface OrderSku {
  id: string;
  priority: string;
  variant_category: {
    name: string;
  };
}

interface Variant {
  id: string;
  name: string;
  variant_category: {
    name: string;
  };
  identifier_code: string;
}

interface VariantOptions {
  value: string;
  label: string;
}

interface ProductSku {
  product_id: string;
  price: number;
  quantity: number;
  variants: string[];
}

interface ProductProps {
  isOpen: boolean;
  handleClick: () => void;
  showProduct: Product;
}

const ShowProduc: React.FC<ProductProps> = ({
  isOpen,
  handleClick,
  showProduct,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const [orderSkus, setOrderSkus] = useState<OrderSku[]>([]);
  const [variants, setVariants] = useState<VariantOptions[]>([]);

  useEffect(() => {
    api
      .get(`/variants`, {
        params: {
          limit: 100,
          page: 1,
        },
      })
      .then(response => {
        const variantsData = response.data.data.variants.map(
          (variant: Variant) => {
            return {
              label: `${variant.name} - ${variant.identifier_code} - ${variant.variant_category.name}`,
              value: variant.id,
            };
          },
        );
        setVariants(variantsData);
      });
  }, []);

  useEffect(() => {
    api.get(`/order-skus/${showProduct.id}`).then(response => {
      setOrderSkus(response.data.data);
    });
  }, [showProduct.id]);

  const handleSubmit = useCallback(
    async (data: ProductFormData) => {
      try {
        const orderSku: ProductSku = {
          product_id: showProduct.id,
          price: data.price,
          quantity: data.quantity,
          variants: [],
        };

        if (data.categoryOne.length > 0) {
          orderSku.variants.push(data.categoryOne);
        }

        if (data.categoryTwo.length > 0) {
          orderSku.variants.push(data.categoryTwo);
        }
        if (data.categoryThree.length > 0) {
          orderSku.variants.push(data.categoryThree);
        }

        await api.post('/product-variants', orderSku);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Variação de categoria cadastrado',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao adicionar variação de categoria',
        });
      }
    },
    [addToast, showProduct.id, history],
  );

  return (
    <>
      <CustomStyles
        isOpen={isOpen}
        onRequestClose={handleClick}
        contentLabel="Example Modal"
      >
        <h2>
          {showProduct.name} - {showProduct.identifier_code}
        </h2>
        <h2>
          Ordem de prioridade é por (
          {orderSkus.map((orderSku, index) => (
            <span>
              {' '}
              <span>{index > 0 ? '- ' : ''}</span>
              {orderSku.variant_category.name}{' '}
            </span>
          ))}
          )
        </h2>

        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input
            name="quantity"
            maxLength={3}
            type="number"
            placeholder="Quantidade"
          />
          <Input name="price" maxLength={5} type="number" placeholder="Preço" />

          <Select
            options={variants}
            name="categoryOne"
            placeholder="Variação 1"
          />
          <Select
            options={variants}
            name="categoryTwo"
            placeholder="Variação 2"
          />
          <Select
            options={variants}
            name="categoryThree"
            placeholder="Variação 3"
          />
          <Button type="submit">Adicionar</Button>
        </Form>
      </CustomStyles>
    </>
  );
};

export default ShowProduc;
