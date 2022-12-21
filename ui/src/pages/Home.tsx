import { DeleteFilled, EditFilled, IdcardOutlined, PlusCircleFilled } from '@ant-design/icons'
import { Button, Col, notification, Modal, Form, Input, Row, Popover, Popconfirm } from 'antd';
import Request from '../services/Request'
import { useEffect, useState } from 'react';
import { TGroup } from '../types';

export const Home = () => {
    const [groups, setGroups] = useState<TGroup[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [form] = Form.useForm()
    const [group, setGroup] = useState<TGroup>()

    const options = (id:string | undefined)=>{
        return(
            <>
                <div className='popover-container'>
                    <Popconfirm
                        title= "¿Seguro de eliminar este grupo?"
                        okText= "Todo lo relacionado a este grupo se eliminara, alumnos, actividades y parciales."
                        okButtonProps={{danger:true}}
                        cancelText="Cancelar"
                        onConfirm= {()=>{deleteGroup(id)}}
                    >
                        <Button type='primary' danger style={{margin:'5px'}}><DeleteFilled /></Button>
                    </Popconfirm>
                    <Button type='primary' style={{margin:'5px'}} onClick={()=>{getGroup(id)}}><EditFilled /></Button>
                </div>
            </>
        )
    }

    useEffect(() => {
        getGroups()
    }, [])
    
    const getGroups = () =>{
        Request.get('/get-groups').then((res)=>{
            setGroups(res.data)
        }).catch((err)=>{
            notification.error({
                placement: 'topRight',
                duration: 3,
                message: "Opss! Al parecer algo salio mal mientras buscabamos tus grupos, intenta crear uno nuevo o recarga la pagina."
            });
        })
    }

    const getGroup = (id:string | undefined) =>{
        Request.get(`/get-group/${id}`).then((res)=>{
            setGroup(res.data)
            setIsEditModalOpen(true)
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
        Request.post('/create-group', {name:groupName}).then((res)=>{
            notification.success({
                placement: 'top',
                duration:3,
                message:"Grupo agregado correctamente!!"
            })
            getGroups()
        }).catch((err)=>{
            notification.error({
                placement: 'topRight',
                duration: 3,
                message: "Opss! Algo salio mal al intentar crear tu grupo, por favor intentalo de nuevo, de lo contrario envianos correo explicando tu situacion."
            });
        })
        setIsModalOpen(false);
        setConfirmLoading(false);
        setGroupName('')
        form.resetFields()
    };

    const deleteGroup = (id:string | undefined) =>{
        Request.delete(`/delete-group/${id}`).then((res)=>{
            notification.success({
                placement: 'topRight',
                duration: 3,
                message: "Grupo eliminado con exito!."
            });
            getGroups()
        }).catch((err)=>{
            notification.error({
                placement: 'topRight',
                duration: 3,
                message: "Opss! Al parecer algo salio mal mientras eliminabamos tu grupo, intenta recarga la pagina."
            });
        })
        
        return;
    }

    const updateGroup = () =>{
        Request.put(`/edit-group/${group?._id}`,{name:groupName}).then((res)=>{
            notification.success({
                placement: 'topRight',
                duration: 3,
                message: "Grupo actualizado con exito!."
            });
            getGroups()
        }).catch((err)=>{
            notification.error({
                placement: 'topRight',
                duration: 3,
                message: "Opss! Al parecer algo salio mal mientras actualizabamos tu grupo, intenta recarga la pagina."
            });
        })
        setGroup(undefined);
        setIsEditModalOpen(false)
        setGroupName('')
        form.resetFields()
    }


    return (
        <div className='default-container'>
            <Row justify='space-between'>
                <Col span={10}>
                    <p className='title-home'>Tus grupos</p>
                </Col>
                <Col offset={8} span={3}>
                    <Button type='text' className='button-home' onClick={showModal}>
                        <PlusCircleFilled 
                            style={{
                                fontSize:'50px'
                            }}
                        />
                    </Button>
                </Col>
                <Col>
                    <Button type='text'
                        className='button-home'
                        style={{
                            fontSize:"20px"
                        }}
                    >
                        Tu perfil<IdcardOutlined 
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
                    groups?.map((group:TGroup, key:number)=>(
                        <a className='sub-card' key={key} href={`/group/${group._id}`}>
                            <Popover content={options(group._id)} title="Opciones" trigger='hover'>
                                <Col>
                                    <p className='sub-card-groups-name'>
                                        {group.name}
                                    </p>
                                    <p className='sub-card-groups-quantity'>
                                        Alumnos:{group.countStudents}
                                    </p>
                                </Col>
                            </Popover>
                        </a>
                    ))
                }
            </Row>  
            <Modal
                title="Crea tu grupo"
                open={isModalOpen}
                onOk={handleOk}
                okButtonProps={{disabled:groupName === ''}}
                onCancel={()=>{setIsModalOpen(false); setGroupName(''); form.resetFields()}}
                confirmLoading={confirmLoading}
                centered={true}
            >
                <div className='default-container'>
                    <Form form={form}>
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Favor de ingresar el nombre de su grupo' }]}
                        >
                        <Input placeholder='Ingrese el nombre de su grupo' onChange={(e:any)=>{setGroupName(e.target.value)}}/>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            <Modal
                title={`Cambia el nombre de tu grupo!. Actual: ${group?.name}`}
                open={isEditModalOpen}
                onOk={updateGroup}
                okButtonProps={{disabled:groupName === ''}}
                onCancel={()=>{setIsEditModalOpen(false); setGroupName(''); setGroup(undefined); form.resetFields()}}
                confirmLoading={confirmLoading}
                centered={true}
            >
                <div className='default-container'>
                    <Form form={form}>
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Favor de ingresar el nombre de su grupo' }]}
                        >
                            <Input onChange={(e:any)=>{setGroupName(e.target.value)}}/>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}
