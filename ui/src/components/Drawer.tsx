import { Button, Col, Drawer, Form, Input, Row, Space, notification } from 'antd';
import Request from '../services/Request'

interface props{
    open: React.Dispatch<boolean>;
    groupID: string;
    updateInfo:() => void;
    partialId:string | undefined;
}

const DrawerComponent = ({ open, groupID, updateInfo, partialId}:props) => {
    const [form] = Form.useForm()
    let studentName = "";

    const onClose = () => {
        open(false);
    }

    const createStudent = ()=>{
        Request.post("/save-students",{students:[studentName], group_id:groupID, partial_id:partialId}).then(_=>{
            notification.success({
                placement: 'top',
                duration:3,
                message:"Estudiante(s) creado(s) correctamente!!"
            })
            open(false)
            updateInfo()
        }).catch(err=>{
            notification.error({
                placement:"top",
                duration:3,
                message:"Opss!! No se pudo agregar el estudiante, por favor intenta nuevamente"
            })
        })
    }
    return (
        <>
            <Drawer
                title="Crear estudiante(s)"
                width={720}
                onClose={onClose}
                open={true}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button onClick={createStudent} type="primary">
                            Crear
                        </Button>
                    </Space>
                }
            >

                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label="Nombre:"
                                rules={[{ required: true, message: 'Favor de ingresar el nombre del estudiante' }]}
                            >
                                <Input placeholder="Ingrese el nombre del estudiante" onChange={(e:any)=>{studentName = e.target.value}} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default DrawerComponent;