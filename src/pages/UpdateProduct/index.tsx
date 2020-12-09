import React, { useRef, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { CustomStyles } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface Product {
  id: string;
  name: string;
  identifier_code: string;
}

interface ProductProps {
  isOpen: boolean;
  handleClick: () => void;
  handleUpdateProductState: (product: Product) => void;
  editProduct: Product;
}

const UpdateProduc: React.FC<ProductProps> = ({
  isOpen,
  handleClick,
  editProduct,
  handleUpdateProductState,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: Product) => {
      handleUpdateProductState(data);
    },
    [handleUpdateProductState],
  );

  return (
    <>
      <CustomStyles
        isOpen={isOpen}
        onRequestClose={handleClick}
        contentLabel="Example Modal"
      >
        <h2>Atualizar produto</h2>
        <Form ref={formRef} onSubmit={handleSubmit} initialData={editProduct}>
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

export default UpdateProduc;
