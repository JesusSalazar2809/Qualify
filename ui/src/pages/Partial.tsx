import { DiffOutlined, HomeFilled, PrinterFilled, RollbackOutlined, SaveFilled, UserAddOutlined } from '@ant-design/icons';
import { Button, Col, notification, Row, InputRef, Form, Input, Table, Tooltip } from 'antd';
import { useState, useEffect, useContext, useRef } from 'react';
import { TPartial, TActivities, TGroup, TStudent, TScores } from '../types';
import Request from '../services/Request'
import { useNavigate, useParams } from 'react-router-dom';
import type { FormInstance } from 'antd/es/form';
import React from 'react';
import DrawerComponent from '../components/Drawer';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};



const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export const Partial = () => {
  const navigate = useNavigate();
    const { id } = useParams();
    const [activities, setActivities] = useState<TActivities[]>()
    const [group, setGroup] = useState<TGroup>()
    const [students, setStudents] = useState<TStudent[]>()
    const [partial, setPartial] = useState<TPartial>()
    const [dataSource, setDataSource] = useState<Array<any>[]>();
    const [openAddStudent, setOpenAddStudent] = useState<boolean>(false)

    useEffect(() => {
        getPartial();
    }, [])
    

    const getPartial = () => {
        Request.get(`/get-partial/${id}`).then((res)=>{
          const {activities, group, students} = res.data;
          console.log("Respuesta del server",res.data)
          setActivities(activities)
          setGroup(group)
          setStudents(students)
          setPartial(res.data)
        }).catch((err)=>{
            notification.error({
                placement: 'topRight',
                duration: 3,
                message: "Opss! Al parecer algo salio mal mientras buscabamos tu parcial, intenta recarga la pagina."
            });
        })
    }

    const GenerateInformationToLoad = () =>{
      const DataSource = students?.map((student:TStudent)=>{
        const object = student.scores.reduce((acc:any, item:TScores) => {
            acc[item.activity_id] = item.score
            return acc
          }, {})
          return {
            key: student._id,
            name:student.name,
            ...object
          }
        })
      //setDataSource(DataSource ? DataSource : [] )
      return DataSource
    }

    const generateColumns = ()=>{
      let arr_actitivies = [];
      const handleSave = (row: any) => {
        console.log("La fila del handleSave",row)
        /* const newData = dataSource;
        if(newData? newData.length : [] > 0){
          const index = newData.findIndex((item) => row.key === item.key);
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setDataSource(newData);
        } */
      };
      const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
          title: 'Nombre del alumno',
          dataIndex: 'name',
          width: '30%',
          editable: true,
        },
      ];
      for(const activity of activities ? activities : []){
        arr_actitivies.push({
          title:`${activity.name}-${activity.percentage}`,
          dataIndex:activity._id,
          editable: true
        })
      }
      const fullcolumns = defaultColumns.concat(arr_actitivies);
      const columns = fullcolumns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: any) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        };
      });
      return columns
    }

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const OpenDrawer = ()=>{
      console.log("Si esta entrando en la funcion")
      setOpenAddStudent(true)
      //return <DrawerComponent open={true} groupID={group?._id || ""}/>
    }
    return (
        <div className='default-container'>
            <Row justify='center'>
                <Col span={1}>
                  <Tooltip title="Ir al home" >
                    <HomeFilled className='icons' onClick={()=>navigate("/home")}/>
                  </Tooltip>
                </Col>
                <Col span={1}>
                  <Tooltip title="Ir al grupo" >
                    <RollbackOutlined className='icons' onClick={()=>navigate(-1)}/>
                  </Tooltip>
                </Col>
                <Col span={9}>
                    <p className='title-home' style={{fontSize:"30px"}}>Grupo: {group?.name} - {partial?.name}</p>
                </Col>
                <Col span={9}>
                  <p style={{
                      verticalAlign:"text-bottom",
                      fontSize:"15px",
                      color:"#47525E"
                    }}
                  >Por favor, use base 100. Ejem. 75, 70, 79</p>
                </Col>
                <Col span={1}>
                  <Tooltip title="Descargar Excel" >
                    <PrinterFilled className='icons'/>
                  </Tooltip>
                </Col>
                <Col span={1}>
                  <Tooltip title="Agregar Alumno" >
                    <UserAddOutlined className='icons' onClick={OpenDrawer}/>
                  </Tooltip>
                </Col>
                <Col span={1}>
                  <Tooltip title="Agregar Actividad" >
                    <DiffOutlined className='icons'/>
                  </Tooltip>
                </Col>
            </Row>
            <hr></hr>
            <div>
              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={GenerateInformationToLoad()}
                columns={generateColumns() as ColumnTypes}
              />
            </div>
            {
              openAddStudent && (
                <DrawerComponent open={setOpenAddStudent} groupID={group?._id || ""} updateInfo={getPartial} partialId={id ? id : ""}></DrawerComponent>
              )
            }
        </div>
    )
}
