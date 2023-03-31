import { DiffOutlined, FormOutlined, HomeFilled, PrinterFilled, RollbackOutlined, UserAddOutlined } from '@ant-design/icons';
import { Col, notification, Row, InputRef, Form, Input, Table, Tooltip } from 'antd';
import { useState, useEffect, useContext, useRef } from 'react';
import { TPartial, TActivities, TGroup, TStudent, TScores } from '../types';
import Request from '../services/Request';
import { useNavigate, useParams } from 'react-router-dom';
import type { FormInstance } from 'antd/es/form';
import React from 'react';
import DrawerComponent from '../components/Drawer';
import AddActivityComponent from '../components/AddActivity';
import { EditColums } from '../components/EditColums';

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
  const [openAddStudent, setOpenAddStudent] = useState<boolean>(false)
  const [openAAddActivity, setOpenAddActivity] = useState<boolean>(false)
  const [totalPercentage, setTotalPercentage] = useState<number>(0);
  const [openEditColums, setOpenEditColums] = useState<boolean>(false)

  useEffect(() => {
      getPartial();
  }, [])
  

  const getPartial = () => {
      Request.get(`/get-partial/${id}`).then((res)=>{
        const {activities, group, students} = res.data;
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

  const calculateTotalScore = (student:TStudent)=>{
    let totalScore = 0;
    let totalPercentage = 0;
    if(student.scores.length > 0){
      student.scores.map(score=>{
        const currentActivity = activities?.filter(activity => activity._id == score.activity_id);
        if(currentActivity && currentActivity[0]){
          totalPercentage += currentActivity[0].percentage;
          totalScore += currentActivity[0].percentage * score.score;
        }
      })
    }
    const total = totalPercentage > 0 ? totalScore/totalPercentage : 0;
    return total.toFixed(2);
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
        total: calculateTotalScore(student),
        ...object
      }
      })
    return DataSource
  }

  const generateColumns = ()=>{
    let arr_actitivies = [];
    const handleSave = (row: any) => {
      console.log(row)
      //Aqui se debe manejar el guardar la calificacion;
    };
    const nameColumn: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
      {
        title: 'Nombre del alumno',
        dataIndex: 'name',
        width: '20%',
        editable: true,
      },
    ];
    const totalColumn: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
      {
        title: 'Calificacion total',
        dataIndex: 'total',
        width: '10%',
        editable: false,
      },
    ];
    for(const activity of activities ? activities : []){
      arr_actitivies.push({
        title:`${activity.name}-${activity.percentage}`,
        dataIndex:activity._id,
        editable: true
      })
    }
    let fullcolumns = arr_actitivies.length > 0 ? nameColumn.concat(arr_actitivies,totalColumn) : nameColumn;
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
          <Tooltip title="Editar actividades" >
            <FormOutlined className='icons' onClick={()=>setOpenEditColums(true)}/>
          </Tooltip>
        </Col>
        <Col span={1}>
          <Tooltip title="Descargar Excel" >
            <PrinterFilled className='icons'/>
          </Tooltip>
        </Col>
        <Col span={1}>
          <Tooltip title="Agregar Alumno" >
            <UserAddOutlined className='icons' onClick={()=>setOpenAddStudent(true)}/>
          </Tooltip>
        </Col>
        <Col span={1}>
          <Tooltip title="Agregar Actividad" >
            <DiffOutlined className='icons' onClick={()=>setOpenAddActivity(true)}/>
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
          pagination={false}
        />
      </div>
      {
        openAddStudent && (
          <DrawerComponent open={setOpenAddStudent} groupID={group?._id || ""} updateInfo={getPartial} partialId={id ? id : ""}></DrawerComponent>
        )
      }
      {
        openAAddActivity && (
          <AddActivityComponent open={setOpenAddActivity} updateInfo={getPartial} partialId={id ? id : ""} currentPercentageUsed={totalPercentage}></AddActivityComponent>
        )
      }
      {
        openEditColums && (
          <EditColums open={setOpenEditColums} updateInfo={getPartial} colums={activities ? activities : []}></EditColums>
        )
      }
    </div>
  )
}
