import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { transparentize } from 'polished';

const activeClassName = 'nav-item-active';

export const Container = styled.div`
  background: #5636d3;
  padding: 30px;

  header {
    max-width: 1120px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    strong {
      font-weight: 500;
    }

    nav {
      a {
        color: ${transparentize(0.3, '#fff')};
        text-decoration: none;
        font-size: 16px;
        transition: opacity 0.2s;
        padding-bottom: 2px;

        & + a {
          margin-left: 32px;
        }

        &:hover {
          opacity: 0.6;
        }
      }
    }
    button {
      margin-left: auto;
      background: transparent !important;
      border: 0;
      svg {
        color: #fff;
        width: 20px;
        height: 20px;
      }
    }
  }

  p {
    color: #fff;
  }

  @media (max-width: 575px) {
    p {
      display: none;
    }

    header {
      justify-content: center;

      nav {
        width: 100%;
        display: flex;
        justify-content: space-around;
      }
    }
  }
`;

export const LinkElement = styled(NavLink).attrs({
  activeClassName,
})`
  &.${activeClassName} {
    color: #fff;
    border-bottom: 2px solid #ff872c;
  }
`;
