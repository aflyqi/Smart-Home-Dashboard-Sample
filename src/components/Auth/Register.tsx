import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import bgImage from '../../assets/bg.png';
import { motion } from 'framer-motion';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(${bgImage}) no-repeat center center fixed !important;
  background-size: cover !important;
  position: relative;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6) !important;
    z-index: 1;
  }
`;

const GlassCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 10px;
  font-size: 2em;
`;

const Subtitle = styled.h2`
  color: #ccc;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.2em;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1em;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin: 20px 0;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Link = styled.a`
  color: white;
  text-decoration: none;
  text-align: center;
  display: block;
  margin-top: 15px;
  font-size: 0.9em;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('密码不匹配');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          info: formData.email
        }),
      });

      const data = await response.json();
      if (data.result === 'succeed') {
        alert('注册成功！');
        navigate('/login');
      } else {
        alert('注册失败：用户名可能已存在');
      }
    } catch (error) {
      console.error('注册错误:', error);
      alert('注册失败，请检查服务器连接');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container>
      <GlassCard
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Energy</Title>
        <Subtitle>User Registration</Subtitle>
        <form onSubmit={handleRegister}>
          <Input
            type="text"
            name="username"
            placeholder="Username *"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button type="submit">REGISTER</Button>
          <Link href="/login">HAVE AN ACCOUNT? LOGIN NOW</Link>
        </form>
      </GlassCard>
    </Container>
  );
};

export default Register; 