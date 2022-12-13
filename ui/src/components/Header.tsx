import Logo from '../images/Logo.png';
import { Row, Col, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

export const Header = () => {
  const logout = ()=>{
    delete localStorage.access_token
    window.location.href = '/'
  }
  return (
    <Row className='header'>
      <Col lg={{offset:1, span:18}}>
          <img src={Logo} className="brand" alt='Logo Qualify'/>
      </Col>
      {
        localStorage.access_token ?(
          <Button type='ghost' className='logout' onClick={logout}>
            Cerrar Sesion <LogoutOutlined />
          </Button>
        ) :
        (
          <Col className='text-header'>
            Contáctanos!
          </Col>
        )
      }
        
    </Row>
  )
}