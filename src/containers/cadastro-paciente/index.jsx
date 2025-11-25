import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { createPatient } from "../../services/createPatient";
import {
  Container,
  Content,
  Title,
  PhotoSection,
  PhotoLabel,
  PhotoCircle,
  PhotoIcon,
  PhotoButtons,
  InsertButton,
  RemoveButton,
  FormSection,
  SectionTitle,
  FormRow,
  FormGroup,
  Label,
  Input,
  SubmitButton
} from './styles';

export default function CadastroPaciente() {
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting form data");
    const payload = {
      name: formData.nome,
      email: formData.email,
      password: formData.senha
    };

    const res = await createPatient(payload);
    if (res.success) {
      alert('Paciente cadastrado com sucesso!');
      setFormData({ nome: '', email: '', senha: '' });
    } else {
      alert(res.message);
    }
  };

  return (
    <Container>
      <Content>
        <Title>Cadastro de Paciente</Title>

        <FormSection>
          <SectionTitle>Dados do Paciente</SectionTitle>

          <FormGroup>
            <Label>Nome do Paciente</Label>
            <Input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Digite o nome completo"
            />
          </FormGroup>

          <FormGroup>
            <Label>Email do Paciente</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@exemplo.com"
            />
          </FormGroup>

          <FormGroup>
            <Label>Senha</Label>
            <Input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              placeholder="••••••••"
            />
          </FormGroup>

          <SubmitButton type="button" onClick={handleSubmit}>
            Cadastrar Paciente
          </SubmitButton>
        </FormSection>
      </Content>
    </Container>
  );
}
