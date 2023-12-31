import { Cancel, CheckCircle, CloudUpload, Delete, FileDownload } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { differenceInDays, format } from 'date-fns';
import {
  MaterialReactTable,
  type MRT_Cell,
  type MRT_ColumnDef,
  type MRT_Row,
  type MaterialReactTableProps,
} from 'material-react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AutoComplete from './AutoComplete';


const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;


// Define interfaces
export interface FileData {
  id: number;
  name: string;
  city: string;
  location: string;
  sede: string;
  activoFijo: string;
  serie: string;
  calibrationDate: Date;
  nextCalibrationDate: Date;
  filePath: string;
  customerId: number;
  certificateTypeId: number;
  deviceId: number
  // Nuevas propiedades para las relaciones
  user: {
    id: number;
    nombre: string;
    // Otras propiedades de User
  };
  device: {
    id: number;
    name: string
    // Otras propiedades de Device
  };
  certificateType: {
    id: number;
    name: string
    // Otras propiedades de Certificate
  };
}


// API URL
const apiUrl = import.meta.env.PUBLIC_API_URL;

// Main component
const Table: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState<FileData[]>([]);



  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Create a new file
  const onCreateFile = async (fileData: FileData) => {

    try {
      const response = await axios.post(`${apiUrl}/files`, fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        },
      });

      if (response.status === 201) {
        toast.success('Certificado Creado Exitosamente!', {
          duration: 4000,
          position: 'top-center',
        });
        fetchUsers(); // Refresh data after creation
      } else {
        console.error('Error al crear equipo');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  // Fetch files data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/files`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
      });



      if (response.statusText === 'OK') {
        // @ts-ignore: Ignorar el error en esta línea
        setTableData(response.data);
      }
    } catch (error) {
      console.error('Error fetching file data:', error);
    }
  };


  const updateUser = async (fileData: FileData) => {

    try {
      const response = await axios.put(`${apiUrl}/files/${fileData.id}`, fileData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        },
      });

      if (response.status === 201) {
        toast.success('Equipo Modificado Exitosamente!', {
          duration: 4000,
          position: 'top-center',
        });
        ; // Refresh data after creation
      } else {
        console.error('Error al crear equipo');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateNewRow = (values: FileData) => {
    console.log("🚀 ~ file: TableFiles.tsx:147 ~ handleCreateNewRow ~ values:", values)
    onCreateFile(values);
    setCreateModalOpen(false);
  };

  const handleSaveRowEdits: MaterialReactTableProps<FileData>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {

      if (!Object.keys(validationErrors).length) {
        const updatedValues = { ...values };
        delete updatedValues.id;
        try {
          const response = await axios.put(`${apiUrl}/files/${values.id}`, updatedValues ,{
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            }
          });

          if (response.status === 201) {
            toast.success('Equipo Modificado Exitosamente!', {
              duration: 4000,
              position: 'top-center',
            });
            tableData[row.index] = values;
            setTableData([...tableData]);
          } else {
            console.error('Error al crear equipo');
          }
        } catch (error) {
          console.error('Error de red:', error);
        }

        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const deleteUser = async (rowIndex: number, id: number) => {
    try {
      const response = await axios.delete(`${apiUrl}/files/${id}`,{ headers: {
        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
      }});

      if (response.status === 201) {
        toast.success('Equipo Eliminado Exitosamente!', {
          duration: 4000,
          position: 'top-center',
        });
        tableData.splice(rowIndex, 1);
        setTableData([...tableData]);
      } else {
        console.error('Error al crear equipo');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }

  const handleDeleteRow = useCallback(
    (row: MRT_Row<FileData>) => {
      if (
        !confirm(`Are you sure you want to delete ${row.getValue('name')}`)
      ) {
        return;
      }
      deleteUser(row.index, row.getValue('id'))
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData],
  );

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<FileData>,
    ): MRT_ColumnDef<FileData>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)
              : cell.column.id === 'age'
                ? validateAge(+event.target.value)
                : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

  const handleDownload = async (row) => {
    const filePath = row.getValue("filePath");

    const partes = filePath.split("-");
    let resultado = "";

    if (partes.length > 1) {
      resultado = partes.slice(1).join("-");
    } else {
      resultado = filePath;
    }

    try {
      const response: AxiosResponse<Blob> = await axios.get(`${apiUrl}/files/download/${filePath}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        },
        responseType: 'blob', // Indicar que esperamos una respuesta binaria
      });




      if (response.statusText = "OK") {

        // Crear un objeto URL para el archivo descargado
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Crear un enlace en el DOM para descargar el archivo
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', resultado); // Nombre del archivo a descargar
             document.body.appendChild(link);


             // Simular el clic en el enlace para iniciar la descarga
             link.click();

             // Liberar el objeto URL y eliminar el enlace después de la descarga
             window.URL.revokeObjectURL(url);
             document.body.removeChild(link);


            }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Manejo de errores de Axios
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          // La solicitud recibió una respuesta del servidor
          toast.error(`Error al descargar el archivo: ${axiosError.response.statusText}`, {
            duration: 4000,
            position: 'top-center',
          });
        } else {
          // La solicitud no recibió una respuesta del servidor
          toast.error(`Error de red al descargar el archivo: ${axiosError.message}`, {
            duration: 4000,
            position: 'top-center',
          });
        }
      } else {
        // Manejo de otros errores
        toast.error(`Error desconocido al descargar el archivo: ${error.message}`, {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  }


  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<FileData>[]>(
    () => [
      {
        accessorKey: 'id', //access nested data with dot notation
        header: 'ID',
        size: 10,
        enableEditing: false,
      },
      {
        accessorKey: 'customer.nombre', //access nested data with dot notation
        header: 'Compañia',
        size: 150,
        enableEditing: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "selectCustomerId"
      },
      {
        accessorKey: 'device.name', //access nested data with dot notation
        header: 'Equipo',
        enableEditing: false,
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "selectDeviceId"
      },
      {
        accessorKey: 'certificateType.name', //access nested data with dot notation
        header: 'Tipo de Certificado',
        size: 150,
        enableEditing: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "selectCertificateTypeId"
      },
      {
        accessorKey: 'name', //access nested data with dot notation
        header: 'Nombre',
        enableEditing: false,
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'city', //access nested data with dot notation
        header: 'Ciudad',
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'location', //access nested data with dot notation
        header: 'Ubicación',
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'sede', //access nested data with dot notation
        header: 'Sede',
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'activoFijo', //access nested data with dot notation
        header: 'Activo Fijo',
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'serie', //access nested data with dot notation
        header: 'Serie',
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'calibrationDate', //access nested data with dot notation
        header: 'Fecha de Calibración',
        size: 250,

        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        Cell: ({ cell }) => (
          <span>{cell.getValue<number>().substring(0, 10)}</span>
        ),

        type: "date"
      },
      {
        accessorKey: 'nextCalibrationDate', //access nested data with dot notation
        header: 'Proxima Fecha de Calibración',
        size: 350,
        Cell: ({ cell, row }) => {
          const now = new Date()
          const nextCalibrationDate = new Date(row.original.nextCalibrationDate);
          const daysRemaining = differenceInDays(nextCalibrationDate, now);
          const formattedCalibrationDate = format(nextCalibrationDate, 'yyyy-MM-dd');

          let icon;
          if (daysRemaining > 0) {
            icon = <CheckCircle sx={{ color: 'green' }} />;
          } else {
            icon = <Cancel sx={{ color: 'red' }} />;
          }

          return (
            <div className="flex flex-col ">
              <div>
                {icon}
                <span className="ml-2">{formattedCalibrationDate}</span>
              </div>
              <span className="mt-2">{daysRemaining < 0 ? 'VENCIDO' : `Días restantes: ${daysRemaining}`}</span>
            </div>
          );

        },
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),

        type: "date"
      },
      {
        accessorKey: 'filePath', //access nested data with dot notation
        header: 'filePath',
        size: 150,
        hidden: true,
        enableEditing: false,
        muiTableBodyCellEditTextFieldProps: ({ cell, column }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        // Cell : (w) => w.column.getIsVisible(),
        type: "upload"
      },




    ],
    [getCommonEditTextFieldProps],
  );



  return (
    <>
      <Toaster />
      {/* <Pdf/> */}
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        positionActionsColumn="last"
        enableHiding={false}
        initialState={{
          columnVisibility: { filePath: false },
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            {/* <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip> */}
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="left" title="Descargar">
              <IconButton onClick={() => handleDownload(row)}>
                <FileDownload />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        // <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Crear Equipo</button>
        renderTopToolbarCustomActions={() => (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
            onClick={() => setCreateModalOpen(true)}

          >
            Subir Nuevo Certificado
          </button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

interface CreateModalProps {
  columns: MRT_ColumnDef<FileData>[];
  onClose: () => void;
  onSubmit: (values: FileData) => void;
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
}: CreateModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const [values, setValues] = useState<any>(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {} as any),
  );


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSelectedFileName(selectedFile.name);
    }
  };

  function logFormData(formData) {
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  }

  const handleSubmit = () => {
    //put your validation logic here

console.log('%cTableFiles.tsx line:575 values', 'color: #007acc;', values["user.name"]);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('city', values.city);
    formData.append('location', values.location);
    formData.append('sede', values.sede);
    formData.append('activoFijo', values.activoFijo);
    formData.append('serie', values.serie);
    formData.append('calibrationDate', values.calibrationDate);
    formData.append('nextCalibrationDate', values.nextCalibrationDate);
    formData.append('pdf', file as Blob);
    formData.append('customerId', values["customer.nombre"].toString());
    formData.append('certificateTypeId', values["certificateType.name"].toString());
    formData.append('deviceId', values["device.name"].toString());

    // .toISOString().split('T')[0]
    logFormData(formData)

    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Subir Nuevo Certificado</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => {

              if (column.accessorKey !== 'id' && column.accessorKey !== 'name') {

                switch (column.type) {
                  case "date":
                    return (
                      <DatePicker
                        label={column.header}
                        name={column.accessorKey}
                        value={values[column.accessorKey]}
                        onChange={(e) => setValues({ ...values, [column.accessorKey]: new Date(e) })}
                      />

                    )
                  case "selectCustomerId":
                    return <AutoComplete
                      endpoint="http://localhost:5050/customers"
                      label="Buscar Cliente"
                      mapOption={(data) =>
                        data.map((item) => ({
                          id: item.id,
                          nombre: item.nombre,
                        }))}
                      //isOptionEqualToValue={(option, value) => option.id === value.id}
                      getOptionLabel={(option) => option.nombre}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      onClientSelection={e => setValues({ ...values, [column.accessorKey]: e.id })}

                    />

                  case "selectDeviceId":
                    return <AutoComplete
                      endpoint="http://localhost:5050/devices"
                      label="Buscar Equipo"
                      mapOption={(data) =>
                        data.map((item: any) => ({
                          id: item.id,
                          name: item.name,
                        }))}
                      getOptionLabel={(option) => option.name}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      onClientSelection={e => setValues({ ...values, [column.accessorKey]: e.id })}

                    />


                  case "selectCertificateTypeId":
                    return <AutoComplete
                      endpoint="http://localhost:5050/certificateTypes"
                      label="Buscar Tipo de Certificado"
                      mapOption={(data) =>
                        data.map((item: any) => ({
                          id: item.id,
                          name: item.name,
                        }))}
                      //isOptionEqualToValue={(option, value) => option?.id?.toString() === (value?.id ?? value)?.toString()}
                      getOptionLabel={(option) => option.name}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      onClientSelection={e => setValues({ ...values, [column.accessorKey]: e.id })}

                    />

                  case "upload":
                    return <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUpload />}
                      href="#file-upload"
                      onChange={handleFileChange}
                      style={{
                        textTransform: "none"
                      }}
                    >
                      {selectedFileName ? selectedFileName : "Cargar Archivo"}
                      <VisuallyHiddenInput type="file" accept=".pdf" />
                    </Button>

                  default:
                    return (
                      <TextField
                        label={column.header}
                        name={column.accessorKey}
                        value={values[column.accessorKey]}
                        onChange={(e) =>
                          setValues({ ...values, [column.accessorKey]: e.target.value })
                        }
                      />
                    )
                }


              }
            }
            )}



          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <button className="bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-10" onClick={onClose} >Cancelar</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit} >
          Subir Certificado
        </button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age: number) => age >= 18 && age <= 50;


export default Table;