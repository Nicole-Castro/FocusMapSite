import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import {
  Container,
  LeftSide,
  LogoBox,
  RightSide,
  FormContainer,
  Title,
  Description,
  FormGroup,
  Label,
  Input,
  Button,
  BackToLogin
} from './styles';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log('Recuperar senha para:', email);
    // Adicione sua lógica de recuperação de senha aqui
    alert('Link de recuperação enviado para: ' + email);
  };

  return (
    <Container>
      <LeftSide>
        <LogoBox>
          <Mail size={120} strokeWidth={1.5} />
        </LogoBox>
      </LeftSide>

      <RightSide>
        <FormContainer>
          <Title>Esqueceu sua senha?</Title>
          <Description>
            Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
          </Description>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </FormGroup>

          <Button onClick={handleSubmit}>
            Enviar Link de Recuperação
          </Button>

          <BackToLogin onClick={() => navigate('/')}>
            ← Voltar para o login
          </BackToLogin>
        </FormContainer>
      </RightSide>
    </Container>
  );
}