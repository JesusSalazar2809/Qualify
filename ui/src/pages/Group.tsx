import { PlusCircleFilled } from '@ant-design/icons'
import { Button, Col, notification, Modal, Form, Input, Row } from 'antd';
import Request from '../services/Request'
import { useEffect, useState } from 'react';
import { TGroup, TPartial } from '../types';
import { useParams } from 'react-router-dom';



export const Group = () => {
    const { id } = useParams();
    const [group, setGroup] = useState<TGroup>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [partialName, setPartialName] = useState("")
    const [form] = Form.useForm()

    useEffect(() => {
        getGroup()
    }, [])
    
    const getGroup = () =>{
        Request.get(`/get-group/${id}`).then((res)=>{
            setGroup(res.data)
        }).catch((err)=>{
            notification.error({
                placement: 'topRight',
                duration: 3,
                message: "Opss! Al parecer algo salio mal mientras buscabamos tu grupo, intenta recarga la pagina."
            });
        })
    }
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        Request.post('/create-partial', {name:partialName, group_id:id}).then((res)=>{
            notification.success({
                placement: 'top',
                duration:3,
                message:"Parcial agregado correctamente!!"
            })
            getGroup()
        }).catch((err)=>{
            notification.error({
                placement: 'topRight',
                duration: 3,
                message: "Opss! Algo salio mal al intentar crear tu parcial, por favor intentalo de nuevo, de lo contrario envianos correo explicando tu situacion."
            });
        })
        setIsModalOpen(false);
        setConfirmLoading(false);
        setPartialName('')
        form.resetFields()
    };


    return (
        <div className='default-container'>
            <Row justify='space-between'>
                <Col>
                    <p className='title-home'>Grupo: {group?.name}</p>
                </Col>
                <Col>
                    <Button type='text' onClick={showModal}>
                        <PlusCircleFilled 
                            style={{
                                fontSize:'50px'
                            }}
                        />
                    </Button>
                </Col>
            </Row>
            <hr></hr>
            <Row>
                {
                    group?.partials?.map((partial:TPartial, key:number)=>(
                        <a className='partial-card' key={key} href={`/partials/${partial._id}`}>
                            <Col>
                                <p className='partial-card-groups-name'>
                                    {partial.name}
                                </p>
                            </Col>
                        </a>
                    ))
                }
            </Row>  
            <Modal
                title="Crea un nuevo parcial"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={()=>{setIsModalOpen(false); setPartialName(''); form.resetFields()}}
                confirmLoading={confirmLoading}
                centered={true}
                //okButtonProps={{disabled={partialName == ''}}}
                okButtonProps={{disabled:partialName === ''}}
            >
                <div className='default-container'>
                    <Form form={form}>
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Favor de ingresar el nombre de su parcial' }]}
                        >
                            <Input placeholder='Ingrese el nombre de su parcial' onChange={(e:any)=>{setPartialName(e.target.value)}}/>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}
