import { Button, Col, Drawer, Form, Input, Row, Space, notification } from 'antd';
import Request from '../services/Request'

interface props{
    open: any;
    groupID: string;
    updateInfo:any;
    partialId:string | undefined;
}

const DrawerComponent = ({ open, groupID, updateInfo, partialId}:props) => {
    const [form] = Form.useForm()
    let studentName = "";

    const onClose = () => {
        open(false);
        console.log("Cerrando")
    }

    const createStudent = ()=>{
        console.log(studentName)
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
                        <Button onClick={onClose}>Cancel</Button>
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
                                label="Name"
                                rules={[{ required: true, message: 'Please enter user name' }]}
                            >
                                <Input placeholder="Please enter user name" onChange={(e:any)=>{studentName = e.target.value}} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default DrawerComponent;