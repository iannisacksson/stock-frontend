import React, { useRef, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { CustomStyles } from './styles';
import { useToast } from '../../hooks/toast';

import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErros';

interface ProductFormData {
  name: string;
  identifier_code: string;
}

interface Product {
  id: string;
  name: string;
  identifier_code: string;
}

interface ProductProps {
  isOpen: boolean;
  handleClick: () => void;
  handleCloseClick: (product: Product) => void;
}

const AddProduc: React.FC<ProductProps> = ({
  isOpen,
  handleClick,
  handleCloseClick,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ProductFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          identifier_code: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post('/products', data);

        addToast({
          type: 'success',
          title: 'Variação de categoria cadastrado',
        });

        handleCloseClick(response.data.data);
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
    [addToast, handleCloseClick],
  );

  return (
    <>
      <CustomStyles
        isOpen={isOpen}
        onRequestClose={handleClick}
        contentLabel="Example Modal"
      >
        <h2>Adicionar uma novo produto</h2>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="name" type="text" placeholder="Nome da produto" />
          <Input
            name="identifier_code"
            maxLength={3}
            type="text"
            placeholder="Código identificador"
          />

          <Button type="submit">Adicionar</Button>
        </Form>
      </CustomStyles>
    </>
  );
};

export default AddProduc;
