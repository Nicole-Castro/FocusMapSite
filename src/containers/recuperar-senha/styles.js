import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
`;

export const LeftSide = styled.div`
  display: none;
  width: 50%;
  background-color: #e5e7eb;
  align-items: center;
  justify-content: center;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

export const LogoBox = styled.div`
  width: 256px;
  height: 256px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  color: #d1d5db;
`;

export const RightSide = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: white;

  @media (min-width: 1024px) {
    width: 50%;
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 448px;
`;

export const Title = styled.h1`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #1f2937;
`;

export const Description = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
  line-height: 1.5;
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    ring: 2px;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #f97316;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 24px;

  &:hover {
    background-color: #ea580c;
  }
`;

export const BackToLogin = styled.button`
  display: block;
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #f97316;
  }
`;