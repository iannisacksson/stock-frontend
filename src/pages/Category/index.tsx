import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { CustomStyles, TableContainer } from './styles';
import { useToast } from '../../hooks/toast';

import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErros';

interface CategoryFormData {
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Data {
  seccuss: boolean;
  data: {
    variantCategories: Category[];
    page: number;
    total: number;
  };
}

interface CategoryProps {
  isOpen: boolean;
  handleClick: () => void;
}

const Category: React.FC<CategoryProps> = ({ isOpen, handleClick }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  useEffect(() => {
    api
      .get('/variant-categories', {
        params: {
          limit: 50,
          page: 1,
        },
      })
      .then(response => {
        setCategories(response.data.data.variantCategories);
      });
  }, []);

  const handleSubmit = useCallback(
    async (data: CategoryFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post('/variant-categories', data);

        setCategories([...categories, response.data.data]);

        addToast({
          type: 'success',
          title: 'Variação de categoria cadastrado',
        });
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
    [addToast, categories],
  );

  return (
    <>
      <CustomStyles
        isOpen={isOpen}
        onRequestClose={handleClick}
        contentLabel="Example Modal"
      >
        <h2>Adicionar uma nova categoria de variação</h2>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="name" type="text" placeholder="Nome da categia" />

          <Button type="submit">Adicionar</Button>
        </Form>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Categoria de variações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </CustomStyles>
    </>
  );
};

export default Category;
