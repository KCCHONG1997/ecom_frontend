'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Card, Breadcrumb, Button, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import {
  ClientSideRowModelModule,
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  TextEditorModule,
  TextFilterModule,
  DateFilterModule,
  CsvExportModule,
  CellValueChangedEvent,
} from 'ag-grid-community';

// Import styles
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { themeQuartz, colorSchemeDark } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ValidationModule,
  TextEditorModule,
  TextFilterModule,
  DateFilterModule,
  CsvExportModule,
]);

// Create the dark theme using the official theming API
const myDarkTheme = themeQuartz.withPart(colorSchemeDark);

const { Content } = Layout;

// Dummy data for tables
const dummyData: Record<string, any[]> = {
  Learners: [
    { id: 'L001', name: 'Alice Johnson', email: 'alice@example.com', enrollmentDate: '2023-01-10' },
    { id: 'L002', name: 'Bob Smith', email: 'bob@example.com', enrollmentDate: '2023-02-05' },
  ],
  Producer: [
    { id: 'P001', producerName: 'EduCorp', contact: 'edu@example.com', website: 'https://educorp.com' },
    { id: 'P002', producerName: 'SkillBoost', contact: 'skill@example.com', website: 'https://skillboost.com' },
  ],
  Courses: [
    { id: 'C001', title: 'React for Beginners', instructor: 'John Doe', category: 'Web Dev', date: '2023-06-01' },
    { id: 'C002', title: 'Advanced TypeScript', instructor: 'Jane Smith', category: 'Programming', date: '2023-07-10' },
  ],
  Admin: [
    { id: 'A001', name: 'Admin One', email: 'admin1@example.com', role: 'Super Admin' },
    { id: 'A002', name: 'Admin Two', email: 'admin2@example.com', role: 'Manager' },
  ],
  'Purchase History': [
    { id: 'PH001', buyer: 'Alice Johnson', course: 'React for Beginners', purchaseDate: '2023-06-05', amount: '49.99' },
    { id: 'PH002', buyer: 'Bob Smith', course: 'Advanced TypeScript', purchaseDate: '2023-07-12', amount: '79.99' },
  ],
  Comments: [
    { id: 'CM001', commenter: 'Alice Johnson', course: 'React for Beginners', comment: 'Great course!', date: '2023-06-06' },
    { id: 'CM002', commenter: 'Bob Smith', course: 'Advanced TypeScript', comment: 'Very detailed.', date: '2023-07-14' },
  ],
};

// Define table structure dynamically
const tableColumns: Record<string, ColDef[]> = {
  Learners: [
    { field: 'id', headerName: 'ID', editable: false },
    { field: 'name', headerName: 'Name', editable: true },
    { field: 'email', headerName: 'Email', editable: true },
    { field: 'enrollmentDate', headerName: 'Enrollment Date', editable: true, filter: 'agDateColumnFilter' },
  ],
  Producer: [
    { field: 'id', headerName: 'ID', editable: false },
    { field: 'producerName', headerName: 'Producer Name', editable: true },
    { field: 'contact', headerName: 'Contact', editable: true },
    { field: 'website', headerName: 'Website', editable: true },
  ],
  Courses: [
    { field: 'title', headerName: 'Title', editable: true },
    { field: 'instructor', headerName: 'Instructor', editable: true },
    { field: 'category', headerName: 'Category', editable: true },
    { field: 'date', headerName: 'Date', editable: true, filter: 'agDateColumnFilter' },
  ],
  Admin: [
    { field: 'id', headerName: 'ID', editable: false },
    { field: 'name', headerName: 'Admin Name', editable: true },
    { field: 'email', headerName: 'Email', editable: true },
    { field: 'role', headerName: 'Role', editable: true },
  ],
  'Purchase History': [
    { field: 'id', headerName: 'ID', editable: false },
    { field: 'buyer', headerName: 'Buyer', editable: true },
    { field: 'course', headerName: 'Course', editable: true },
    { field: 'purchaseDate', headerName: 'Purchase Date', editable: true },
    { field: 'amount', headerName: 'Amount', editable: true },
  ],
  Comments: [
    { field: 'commenter', headerName: 'Commenter', editable: true },
    { field: 'course', headerName: 'Course', editable: true },
    { field: 'comment', headerName: 'Comment', editable: true },
    { field: 'date', headerName: 'Date', editable: true, filter: 'agDateColumnFilter' },
  ],
};

const AdminManagementPage = () => {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState<string>('Courses');
  // Set up rowData state to hold current table data.
  const [rowData, setRowData] = useState<any[]>(dummyData[selectedTable]);
  // Store grid API reference for exporting.
  const [gridApi, setGridApi] = useState<any>(null);

  // Update rowData when selectedTable changes
  useEffect(() => {
    setRowData(dummyData[selectedTable]);
  }, [selectedTable]);

  // Memoized column definitions
  const columnDefs = useMemo<ColDef[]>(() => {
    return [...tableColumns[selectedTable]];
  }, [selectedTable]);

  // Memoized row selection options
  const rowSelection = useMemo<RowSelectionOptions>(() => {
    return { mode: 'multiRow', enableSelectionWithoutKeys: true };
  }, []);

  // onGridReady: store grid API reference
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    console.log('Grid is ready');
  }, []);

  // Function to export selected rows as CSV
  const exportSelectedRows = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv({ onlySelected: true });
    }
  }, [gridApi]);

  // Inline editing is now done directly in the grid.
  // Enable single click editing for Learners, Producer, and Courses.
  // const enableSingleClickEdit =
  //   selectedTable === 'Learners' || selectedTable === 'Producer' || selectedTable === 'Courses';

  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent) => {
      if (event.rowIndex === null) return; // or handle null case appropriately
      const updatedData = [...rowData];
      updatedData[event.rowIndex] = event.data;
      setRowData(updatedData);
      message.success('Data updated successfully.');
    },
    [rowData]
  );
    
  return (
    <Layout style={{ minHeight: '100vh', background: '#141414' }}>
      <Content style={{ padding: '24px' }}>
        <Breadcrumb style={{ marginBottom: '16px', color: '#fff' }}>
          {Object.keys(dummyData).map((item) => (
            <Breadcrumb.Item key={item}>
              <a
                onClick={() => setSelectedTable(item)}
                style={{ color: selectedTable === item ? '#1890ff' : '#fff' }}
              >
                {item}
              </a>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>

        {selectedTable === 'Admin' && (
          <Button
            onClick={() => navigate('/adminCreation')}
            type="primary"
            style={{ marginBottom: 16, marginRight: '5px' }}
          >
            Create New Admin Account
          </Button>
        )}

        {/* Export Button */}
        <Button onClick={exportSelectedRows} type="primary" style={{ marginBottom: 16, marginRight: '5px' }}>
          Export Selected Rows as CSV
        </Button>

        <div className="aggrid_div" style={{ height: 500, width: '100%' }}>
          <AgGridReact
            theme={myDarkTheme}
            columnDefs={columnDefs}
            rowData={rowData} // Pass rowData state here
            defaultColDef={{ flex: 1, resizable: true, sortable: true, filter: true }}
            rowSelection={rowSelection}
            onGridReady={onGridReady}
            rowHeight={30}
            // singleClickEdit={enableSingleClickEdit}
            onCellValueChanged={onCellValueChanged}
            onSelectionChanged={(params) => {
              const selectedRows = params.api.getSelectedRows();
              console.log('Selected Rows:', selectedRows);
            }}
          />
        </div>

        <Card
          title="Raw Data (Debug)"
          style={{ marginTop: 16, backgroundColor: '#1f1f1f', color: '#ffffff' }}
          styles={{ header: { color: '#fff' } }}
        >
          <pre style={{ color: '#fff' }}>{JSON.stringify(dummyData[selectedTable], null, 2)}</pre>
        </Card>
      </Content>
    </Layout>
  );
};

export default AdminManagementPage;
