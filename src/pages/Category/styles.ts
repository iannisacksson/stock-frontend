import { transparentize, shade } from 'polished';
import ReactPaginate from 'react-paginate';
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
  form {
    display: flex;
    margin: 15px 0;
    position: relative;
    text-align: center;

    > div {
      width: 90%;
    }

    button {
      margin: 0;
      position: absolute;
      right: 0;
      width: 10%;
    }

    a {
      color: #f1ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
`;

export const TableContainer = styled.section`
  margin-top: 64px;
  max-width: 100%;
  overflow: scroll;
  width: 100%;
  margin: 0 auto;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0px;
  }

  table {
    width: 100%;
    border-spacing: 0 8px;

    th {
      color: #969cb3;
      font-weight: normal;
      padding: 20px 32px;
      text-align: center;
      font-size: 16px;
      line-height: 24px;
    }

    td {
      padding: 20px 32px;
      border: 0;
      background: #fff;
      font-size: 16px;
      font-weight: normal;
      color: #969cb3;
      text-align: center;

      button {
        margin-left: auto;
        background: transparent;
        border: 0;

        svg {
          color: #999591;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
    }

    td:first-child {
      border-radius: 8px 0 0 8px;
    }

    td:last-child {
      border-radius: 0 8px 8px 0;
    }
  }
`;

export const Paginate = styled(ReactPaginate)``;
