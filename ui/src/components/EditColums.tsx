import React from 'react'
import { TActivities } from '../types';
import { notification, Drawer, Space, Button, Row, Col, Input, Form } from 'antd';
import Request from '../services/Request';
interface props{
    open: React.Dispatch<boolean>;
    updateInfo:() => void;
    colums:TActivities[];
}

interface values{
    _id?:string;
    name:string;
    percentage:number;
}

export const EditColums = ({open, updateInfo, colums}: props) => {
    const onClose = () => {
        open(false);
    }

    const editActivity = (values:values)=>{
        const {_id} = values;
        delete values._id
        Request.put("/edit-activity/"+ _id, values).then(_=>{
            notification.success({
                placement: 'top',
                duration:3,
                message:"Actividad actualizada correctamente!!"
            })
            open(false)
            updateInfo()
        }).catch(err=>{
            notification.error({
                placement:"top",
                duration:3,
                message:"Opss!! No se pudo editar la actividad, por favor intenta nuevamente"
            })
        })
    }
    return (
        <>
            <Drawer
                title="Editar actividades"
                width={720}
                onClose={onClose}
                open={true}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancelar</Button>
                    </Space>
                }
            >
            {
                colums.map((colum:TActivities, key:number)=>(
                    <>
                        <Form layout="vertical" onFinish={editActivity} key={key}>
                            <Row gutter={16}>
                                <p className='sub-title-home'>{colum.name}</p>
                                <Col span={24}>
                                    <Form.Item
                                        name="name"
                                        label="Nombre:"
                                        rules={[{ required: true, message: 'Favor de ingresar el nombre de la actividad' }]}
                                        initialValue={colum.name}
                                    >
                                        <Input defaultValue={colum.name} placeholder="Ingrese el nombre de la actividad"/>
                                    </Form.Item>
                                    <Form.Item
                                        name="percentage"
                                        label="Porcentaje:"
                                        initialValue={colum.percentage}
                                        rules={[{ required: true, message: 'Favor de ingresar el porcentaje de la actividad' }]}
                                    >
                                        <Input type='number' defaultValue={colum.percentage} placeholder="Ingrese el porcentaje de la actividad"/>
                                    </Form.Item>
                                    <Form.Item name="_id" initialValue={colum._id}></Form.Item>
                                    <Form.Item>
                                        <Button type='primary' htmlType='submit'> Guardar </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </>
                ))
            }
            </Drawer>
        </>
    );
}
