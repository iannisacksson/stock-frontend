import styled from 'styled-components';

export const Container = styled.div``;

export const TableContainer = styled.section`
  margin-top: 64px;
  max-width: 100%;
  overflow: scroll;
  max-width: 1120px;
  margin: 0 auto;

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

export const TableButton = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;

  button {
    margin-right: 10px;
    margin-left: 10px;
  }
`;
