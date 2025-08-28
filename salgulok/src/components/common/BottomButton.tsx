import styled from "styled-components";
import type { FC, ReactNode, MouseEventHandler } from "react";

type BottomButtonProps = {
  text: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const BottomButton: FC<BottomButtonProps> = ({ text, onClick }) => {
  return (
    <Layout onClick={onClick}>
      <Text>{text}</Text>
    </Layout>
  );
};

export default BottomButton;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: fixed;
  bottom: 0;
  align-items: center;
  background-color: var(--main-pri);
  color: var(--white);
  border-radius: 10px;
  cursor: pointer;
  height: 44px;
  width: 335px;
  margin: 0px 20px 15px 20px;
`;
const Text = styled.text`
  font-size: 16px;
  font-weight: 500;
`;
