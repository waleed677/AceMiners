import styled from "styled-components";
export const StyledRoundButton = styled.button`
  padding: 10px;
  border: none;
  padding: 10px;
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--primary);
  width: 10px;
  height: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background:transparent;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;