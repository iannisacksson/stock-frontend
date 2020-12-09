import { transparentize } from 'polished';
import Modal from 'react-modal';
import styled from 'styled-components';

const customStyles = {
  overlay: {
    background: `${transparentize(0.3, '#000')}`,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
};

export const CustomStyles = styled(Modal).attrs({
  style: customStyles,
})`
  background: #f0f2f5;
  padding: 30px;
  border-radius: 4px;
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;

  h2 {
    font-weight: 500;
    color: #666360;
    padding: 20px 0;
    text-align: center;
  }
`;
