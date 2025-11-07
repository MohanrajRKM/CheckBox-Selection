import { Grid, Column, Columns, type GridRef, TextAlign, type EditSettings, type PageSettings, type SortSettings, type FilterSettings, type SearchSettings } from '@syncfusion/react-grid';
import { Provider } from '@syncfusion/react-base';
import { useRef, useState } from 'react';
import './App.css';
import { generateDynamicData } from './orderDetails';
import { Button } from '@syncfusion/react-buttons';
import { DataManager, ODataV4Adaptor, WebApiAdaptor } from '@syncfusion/react-data';

// const data = generateDynamicData(100);

export default function App() {
    const stTime = useRef(0);
    const edTime = useRef(0);
    const diff = useRef(0);
    const showPerformanceMetrics = false;
    const gridRef = useRef<GridRef>(null);
    const [flag, setFlag] = useState(false);

    // Data source mode and local data count
    const [dataMode, setDataMode] = useState<'local' | 'webapi' | 'odata'>('local');
    const [dataCount, setDataCount] = useState<number>(100);
    const [localData, setLocalData] = useState(generateDynamicData(100));

    const [filterSettings] = useState<FilterSettings>({ enabled: true });
    const [sortSettings] = useState<SortSettings>({ enabled: true });
    const [pageSettings, setPageSettings] = useState<PageSettings>({ enabled: true, pageSize: 7, pageCount: 4 });
    const [editSettings] = useState<EditSettings>({ allowEdit: true, allowAdd: false, allowDelete: true });
    const [toolbarSettings] = useState<string[]>(['Search']);
    const [searchSettings] = useState<SearchSettings>({ enabled: true });

    // Remote data sources
    const webApiData = new DataManager({ url: 'https://services.syncfusion.com/js/production/api/Orders', adaptor: new WebApiAdaptor() });
    const odataV4Data = new DataManager({ url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Orders', adaptor: new ODataV4Adaptor() });

    // Resolve current dataSource based on mode
    const currentDataSource = dataMode === 'local' ? localData : (dataMode === 'webapi' ? webApiData : odataV4Data);

    const onGridRenderStart = () => {
        console.log('load triggered!');
        if (showPerformanceMetrics) {
            stTime.current = performance.now();
        }
    };

    const onDataLoad = () => {
        console.log('dataBound triggered! gridRef => ', gridRef.current);
        if (showPerformanceMetrics) {
            edTime.current = performance.now();
            diff.current = parseInt((edTime.current - stTime.current).toFixed(0));
            const perfElement = document.getElementById('performanceTime');
            if (perfElement) {
                perfElement.innerHTML = `Time Taken for Initial Load: <b>${diff.current}ms</b>`;
            }
            stTime.current = 0;
            edTime.current = 0;
            diff.current = 0;
        }
    };

    const applyLocalCount = () => {
        const count = Math.max(0, Number(dataCount));
        const newData = generateDynamicData(count);
        setLocalData(newData);
        // Update totalRecordsCount so pager reflects the new dataset size
        setPageSettings((ps) => ({ ...ps, totalRecordsCount: count }));
    };

    const switchMode = (mode: 'local' | 'webapi' | 'odata') => {
        setDataMode(mode);
        if (mode === 'local') {
            setPageSettings((ps) => ({ ...ps, totalRecordsCount: localData.length }));
        } else {
            // For remote data, let Grid calculate based on server response
            setPageSettings((ps) => ({ ...ps, totalRecordsCount: undefined }));
        }
    };

    return (
        <div style={{ margin: '10px' }}>
            <Provider ripple={true}>
                <div style={{ margin: '10px' }}>
                    <Button onClick={() => setFlag(true)} className='e-primary' style={{ marginRight: '10px', marginBottom: '10px' }}>
                        Render Grid
                    </Button>
                    <Button onClick={() => setFlag(false)} className='e-primary' style={{ marginRight: '10px' }}>
                        Destroy Grid
                    </Button>
                    <Button onClick={() => console.log('GridRef => ', gridRef.current)} className='e-primary' style={{ marginRight: '10px' }}>
                        Get GridRef
                    </Button>
                    <Button onClick={() => console.log('Get Selected Records => ', gridRef.current?.getSelectedRecords())} className='e-primary' style={{ marginRight: '10px' }}>
                        Get Selected Records
                    </Button>
                    <Button onClick={() => gridRef.current?.selectionModule?.selectRows([0, 2, 5])} className='e-primary' style={{ marginRight: '10px' }}>
                        Select Rows
                    </Button>
                    <Button onClick={() => gridRef.current?.selectionModule?.selectRowByRange(0, 11)} className='e-primary' style={{ marginRight: '10px' }}>
                        Select Rows By Range
                    </Button>
                    <Button onClick={() => gridRef.current?.clearSelection()} className='e-primary' style={{ marginRight: '10px' }}>
                        Clear Selection
                    </Button>
                    <Button onClick={() => gridRef.current?.refresh()} className='e-primary' style={{ marginRight: '10px' }}>
                        Refresh
                    </Button>
                </div>

                <div style={{ margin: '10px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>Data Source:</span>
                    <Button onClick={() => switchMode('local')} >Local</Button>
                    {/* <Button onClick={() => switchMode('webapi')} >Web API</Button>
                    <Button onClick={() => switchMode('odata')} >OData V4</Button> */}

                    {dataMode === 'local' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 16 }}>
                            <label htmlFor='count'>Count</label>
                            <input id='count' type='number' value={dataCount} onChange={(e) => setDataCount(Number(e.target.value))} style={{ width: 90 }} />
                            <Button onClick={applyLocalCount}>Apply</Button>
                        </span>
                    )}
                </div>

                {showPerformanceMetrics && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0 }}>Performance Metrics</h4>
                        <p id='performanceTime' style={{ margin: 0 }}></p>
                    </div>
                )}

                {flag && (
                    <Grid
                        dataSource={currentDataSource}
                        ref={gridRef}
                        selectionSettings={{ enabled: true, mode: 'Multiple', headerCheckbox: true }}
                        onGridRenderStart={onGridRenderStart}
                        onDataLoad={onDataLoad}
                        editSettings={editSettings}
                        toolbar={toolbarSettings}
                        filterSettings={filterSettings}
                        sortSettings={sortSettings}
                        pageSettings={pageSettings}
                        searchSettings={searchSettings}
                        onRowSelecting={(args) => {
                            console.log('RowSelecting row', args);
                        }}
                        onRowSelect={(args) => {
                            console.log('RowSelected row', args);
                        }}
                        onRowDeselect={(args) => {
                            console.log('RowDeSelected row', args);
                        }}
                        onRowDeselecting={(args) => {
                            console.log('RowDeSelecting row', args);
                        }}
                    >
                        <Columns>
                            <Column type='checkbox' width='50'></Column>
                            <Column field='OrderID' headerText='Order ID' width='90' textAlign={TextAlign.Right} isPrimaryKey={true}></Column>
                            <Column field='CustomerName' headerText='Customer Name' width='120'></Column>
                            <Column field='ShipCity' headerText='Ship City' width='140'></Column>
                            <Column field='Freight' headerText='Freight Charges' width='130' format='C2' textAlign={TextAlign.Right} />
                            <Column field='ShipCountry' headerText='Ship Country' width='120'></Column>
                        </Columns>
                    </Grid>
                )}
            </Provider>
        </div>
    );
}
