import React from 'react';

import { FiPower } from 'react-icons/fi';
import { Container, LinkElement } from './styles';
import { useAuth } from '../../hooks/auth';

const Header: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container>
      <header>
        <nav>
          <LinkElement to="/dashboard" exact>
            Listagem
          </LinkElement>
          <LinkElement to="/product">Produtos</LinkElement>
        </nav>

        <button type="button" onClick={signOut}>
          <FiPower />
        </button>
      </header>
    </Container>
  );
};

export default Header;
