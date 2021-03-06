import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { FiLogIn, FiMail, FiLock, FiUser } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

import logoImg from '../../assets/logo.svg';

interface SignUpFormData {
  nome: string;
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/users', data);

        history.push({ pathname: '/dashboard' });

        addToast({
          title: 'Cadastro realizado!',
          type: 'success',
          description: 'Você já pode fazer login no GoBarber!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente',
        });
      }
    },
    [addToast, history],
  );

  return (
    <>
      <Container>
        <Background />
        <Content>
          <AnimationContainer>
            <img src={logoImg} alt="GoBarber" />

            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Faça seu cadastro</h1>
              <Input name="name" icon={FiUser} placeholder="Nome" />
              <Input name="email" icon={FiMail} placeholder="E-mail" />
              <Input
                name="password"
                icon={FiLock}
                type="password"
                placeholder="Senha"
              />
              <Button type="submit">Cadastrar</Button>
            </Form>

            <Link to="/">
              <FiLogIn />
              Voltar para o login
            </Link>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  );
};

export default SignIn;
