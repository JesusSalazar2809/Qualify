import { Button, Col, Drawer, Form, Input, Row, Space, notification } from 'antd';
import Request from '../services/Request'

interface props{
    open: React.Dispatch<boolean>;
    updateInfo:() => void;
    partialId:string | undefined;
    currentPercentageUsed:number;
}

const AddActivityComponent = ({ open, updateInfo, partialId, currentPercentageUsed}:props) => {
    const [form] = Form.useForm()
    let name = "";
    let percentage = 0;

    const onClose = () => {
        open(false);
    }

    const createStudent = ()=>{
        Request.post("/create-activity",{name, percentage, partial_id:partialId}).then(_=>{
            notification.success({
                placement: 'top',
                duration:3,
                message:"Actividad creada correctamente!!"
            })
            open(false)
            updateInfo()
        }).catch(err=>{
            notification.error({
                placement:"top",
                duration:3,
                message:"Opss!! No se pudo agregar la actividad, por favor intenta nuevamente"
            })
        })
    }
    return (
        <>
            <Drawer
                title="Crear actividad"
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
                                rules={[{ required: true, message: 'Favor de ingresar el nombre de su actividad' }]}
                            >
                                <Input placeholder="Nombre de la activdad" onChange={(e:any)=>{name = e.target.value}} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="percentage"
                                label="Porcentaje:"
                                rules={[{ required: true, message: 'Favor de ingresar un porcentaje' }]}
                            >
                                <Input placeholder="Ingrese el porcentaje para esta actividad" type='number' onChange={(e:any)=>{percentage = e.target.value}} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default AddActivityComponent;