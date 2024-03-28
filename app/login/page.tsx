'use client';

import api from '@/libs/axios';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    const {
      data: { access_token },
    } = await api.post('/v1/auth/login', values);

    localStorage.setItem('access_token', access_token);
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1000);
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: 300 }}>
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        <Form name='login-form' onFinish={onFinish}>
          <Form.Item name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input placeholder='Username' />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder='Password' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading} style={{ width: '100%' }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
