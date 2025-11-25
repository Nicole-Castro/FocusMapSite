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
  margin-bottom: 32px;
  color: #1f2937;
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

export const ForgotPassword = styled.button`
  display: block;
  margin-left: auto;
  margin-bottom: 24px;
  font-size: 14px;
  color: #f97316;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #ea580c;
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
  margin-bottom: 16px;

  &:hover {
    background-color: #ea580c;
  }
`;

export const GoogleButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: white;
  color: #f97316;
  font-weight: 500;
  border: 2px solid #f97316;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;

  &:hover {
    background-color: #fff7ed;
  }
`;

export const GoogleIcon = styled.svg`
  width: 20px;
  height: 20px;
`;

export const SignUpText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #4b5563;
  margin-top: 24px;
`;

export const SignUpLink = styled.button`
  color: #f97316;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #ea580c;
  }
`;