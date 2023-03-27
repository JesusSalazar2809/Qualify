import { Button, Form, Input, Card, Row, Col, notification } from 'antd';
import { useState } from 'react';
import Request from '../services/Request'

export const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onFinish = (values: any) => {
    setIsLoading(true);
    Request.post('/sign-in',values).then((res)=>{
      setIsLoading(false);
      localStorage.access_token = res.data
      window.location.href='/home'
    }).catch((err)=>{
      setIsLoading(false);
      return notification.error({
        placement: 'topRight',
        duration: 3,
        message: "Opss! La información que ingresaste parece ser incorrecta, intenta nuevamente, por favor."
      });
    })
  };
  
  return (
    <Row>
      <Col className='card'>
        <p className='title'>Bienvenido a Qualify!</p>
        <p className='sub-title'>Tu aplicacion para calificar en linea!</p>
        <Form
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            wrapperCol={{offset:1}}
            name="email"
            rules={[{ required: true, message: 'Favor de ingresar su email' }]}
          >
            <Input className='inputs' placeholder='Ingrese su correo electronico' />
          </Form.Item>

          <Form.Item
            wrapperCol={{offset:1}}
            name="password"
            rules={[{ required: true, message: 'Favor de ingresar su contraseña' }]}
          >
            <Input.Password className='inputs' placeholder='Ingrese su contraseña' />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 7 }}>
            <Button htmlType="submit" className='button' type='ghost' loading={isLoading}>
              Ingresar
            </Button>
          </Form.Item>
        </Form>
        <Row>
          <Col className='text-login'>
            <a href='/sign-up'>Crea tu cuenta gratis!</a>
          </Col>
          <Col className='text-login'>
            <a href='/recover-password'>¿Olvidaste tu contraseña?</a>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
