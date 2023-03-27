import { DeleteFilled, EditFilled, PlusCircleFilled } from '@ant-design/icons'
import { Button, Col, notification, Modal, Form, Input, Row, Popconfirm, Popover } from 'antd';
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [partial, setPartial] = useState<TPartial>()

    const options = (id:string | undefined)=>{
        return(
            <>
                <div className='popover-container'>
                    <Popconfirm
                        title= "¿Seguro de eliminar este parcial?"
                        okText= "Todas las actividades relacionadas a este parcial se eliminaran."
                        okButtonProps={{danger:true}}
                        cancelText="Cancelar"
                        onConfirm= {()=>{deletePartial(id)}}
                    >
                        <Button type='primary' danger style={{margin:'5px'}}><DeleteFilled /></Button>
                    </Popconfirm>
                    <Button type='primary' style={{margin:'5px'}} onClick={()=>{getPartial(id)}}><EditFilled /></Button>
                </div>
            </>
        )
    }

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

    const getPartial = (id:string | undefined) =>{
        Request.get(`/get-partial/${id}`).then((res)=>{
            setPartial(res.data)
            setIsEditModalOpen(true)
        }).catch((err)=>{
            notification.error({
                placement: 'topRight',
                duration: 3,
                message: "Opss! Al parecer algo salio mal mientras buscabamos tu parcial, intenta recarga la pagina."
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

    const deletePartial = (id:string | undefined) =>{
        Request.delete(`/delete-partial/${id}`).then((res)=>{
            notification.success({
                placement: 'topRight',
                duration: 3,
                message: "Parcial eliminado con exito!."
            });
            getGroup()
        }).catch((err)=>{
            notification.error({
                placement: 'topRight',
                duration: 3,
                message: "Opss! Al parecer algo salio mal mientras eliminabamos tu parcial, intenta recarga la pagina."
            });
        })
        
        return;
    }

    const updatePartial = () =>{
        Request.put(`/edit-partial/${partial?._id}`,{name:partialName}).then((res)=>{
            notification.success({
                placement: 'topRight',
                duration: 3,
                message: "Parcial actualizado con exito!."
            });
            getGroup()
        }).catch((err)=>{
            notification.error({
                placement: 'topRight',
                duration: 3,
                message: "Opss! Al parecer algo salio mal mientras actualizabamos tu parcial, intenta recarga la pagina."
            });
        })
        setPartial(undefined);
        setIsEditModalOpen(false)
        setPartialName('')
        form.resetFields()
    }


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
                        <a className='partial-card' key={key} href={`/partial/${partial._id}`}>
                            <Popover content={options(partial._id)} title="Opciones" trigger='hover'>
                                <Col>
                                    <p className='partial-card-groups-name'>
                                        {partial.name}
                                    </p>
                                </Col>
                            </Popover>
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
            <Modal
                title={`Cambia el nombre de tu parcial!. Actual: ${partial?.name}`}
                open={isEditModalOpen}
                onOk={updatePartial}
                okButtonProps={{disabled:partialName === ''}}
                onCancel={()=>{setIsEditModalOpen(false); setPartialName(''); setPartial(undefined); form.resetFields()}}
                confirmLoading={confirmLoading}
                centered={true}
            >
                <div className='default-container'>
                    <Form form={form}>
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Favor de ingresar el nombre de su parcial' }]}
                        >
                            <Input onChange={(e:any)=>{setPartialName(e.target.value)}}/>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}
