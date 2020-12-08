import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { CustomStyles, TableContainer } from './styles';
import { useToast } from '../../hooks/toast';

import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';

import getValidationErrors from '../../utils/getValidationErros';

interface CategoryFormData {
  identifier_code: string;
  name: string;
  variant_category_id: string;
}

interface Variant {
  id: string;
  name: string;
  variant_category: {
    name: string;
  };
  identifier_code: string;
}

interface Data {
  seccuss: boolean;
  data: {
    variants: Variant[];
    page: number;
    total: number;
  };
}

interface VariantProps {
  isOpen: boolean;
  handleClick: () => void;
}

interface Options {
  value: string;
  label: string;
}

interface Category {
  data: {
    variantCategories: { id: string; name: string }[];
  };
}

const Variant: React.FC<VariantProps> = ({ isOpen, handleClick }) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [options, setOptions] = useState<Options[]>([]);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  useEffect(() => {
    api
      .get<Data>('/variants', {
        params: {
          limit: 50,
          page: 1,
        },
      })
      .then(response => {
        setVariants(response.data.data.variants);
      });
  }, []);

  useEffect(() => {
    api
      .get<Category>('/variant-categories', {
        params: {
          limit: 50,
          page: 1,
        },
      })
      .then(response => {
        const categories = response.data.data.variantCategories.map(
          category => {
            return { value: category.id, label: category.name };
          },
        );

        setOptions(categories);
      });
  }, []);

  const handleSubmit = useCallback(
    async (data: CategoryFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          identifier_code: Yup.string().required('Campo obrigatório'),
          variant_category_id: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post('/variants', data);

        const option = options.find(
          optints => data.variant_category_id === optints.value,
        );

        Object.assign(response.data.data, {
          variant_category: { name: option?.label },
        });

        setVariants([response.data.data, ...variants]);

        addToast({
          type: 'success',
          title: 'Variação cadastrada',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao adicionar variação',
        });
      }
    },
    [addToast, variants, options],
  );

  return (
    <>
      <CustomStyles
        isOpen={isOpen}
        onRequestClose={handleClick}
        contentLabel="Example Modal"
      >
        <h2>Adicionar uma nova variação</h2>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="name" type="text" placeholder="Nome da variação" />
          <Input
            name="identifier_code"
            type="text"
            maxLength={3}
            placeholder="Código identificador"
          />
          <Select options={options} name="variant_category_id" />

          <Button type="submit">Adicionar</Button>
        </Form>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Variações</th>
                <th>Código identificação</th>
                <th>Variação de categoria</th>
              </tr>
            </thead>
            <tbody>
              {variants.map(variant => (
                <tr key={variant.id}>
                  <td>{variant.name}</td>
                  <td>{variant.identifier_code}</td>
                  <td>{variant.variant_category.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </CustomStyles>
    </>
  );
};

export default Variant;
