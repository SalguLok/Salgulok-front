import React from "react";
import styled from "styled-components";
import Calendar from "../../components/log/Calendar";

const CreateDatePage: React.FC = () => {
  return (
    <Container>
        <Calendar />
    </Container>
  );
};

export default CreateDatePage;

const Container = styled.div`
    margin: 50px 0; //임시
    padding: 0 20px;
`;