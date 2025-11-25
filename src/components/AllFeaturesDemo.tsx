import { Grid, Column, Columns, type GridRef, TextAlign, type EditSettings, type PageSettings, type SortSettings, type FilterSettings, type SearchSettings } from '@syncfusion/react-grid';
import { Provider } from '@syncfusion/react-base';
import { useRef, useState } from 'react';
import { Button } from '@syncfusion/react-buttons';
import { DataManager, ODataV4Adaptor, Query, WebApiAdaptor } from '@syncfusion/react-data';
import { generateDynamicData } from '../orderDetails';


export default function App() {
    const stTime = useRef(0);
    const edTime = useRef(0);
    const diff = useRef(0);
    const showPerformanceMetrics = false;
    const gridRef = useRef<GridRef>(null);
    const [flag, setFlag] = useState(false);

    // Data source mode and local data count
    const [dataMode, setDataMode] = useState<'local' | 'webapi' | 'odata'>('local');
    const [dataCount, setDataCount] = useState<number>(500);
    const [localData, setLocalData] = useState(generateDynamicData(500));
    const [selectionSettings, setSelectionSettings] = useState({
        enabled: true,
        mode: 'Multiple' as const,
        headerCheckbox: true,
        persistSelection: false,
    });

    const [filterSettings] = useState<FilterSettings>({ enabled: true });
    const [sortSettings] = useState<SortSettings>({ enabled: true });
    const [pageSettings, setPageSettings] = useState<PageSettings>({ enabled: true, pageSize: 7, pageCount: 4 });
    const [editSettings] = useState<EditSettings>({ allowEdit: false, allowAdd: true, allowDelete: true });
    const [toolbarSettings] = useState<string[]>(['Delete', 'Add','Search']);
    const [searchSettings] = useState<SearchSettings>({ enabled: true });

    // Remote data sources
    const webApiData = new DataManager({ url: 'https://ej2services.syncfusion.com/react/hotfix/api/GridWebAPIService/', adaptor: new WebApiAdaptor() });
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

     const onActionBegin = (args: any) => {
        stTime.current = 0;
        edTime.current = 0;
        diff.current = 0;
        console.log('Native React Grid actionBegin triggered => ', args);
        if (showPerformanceMetrics) {
            stTime.current = performance.now();
            console.log(stTime.current);
        }
    }

    const onActioncomplete = (args?: any) => {
        console.log('Native React Grid actionComplete triggered => ', args);
        if (showPerformanceMetrics) {
            edTime.current = performance.now();
            console.log(stTime.current);
            console.log(edTime.current);
            diff.current = parseInt((edTime.current - stTime.current).toFixed(0));
            const perfElement = document.getElementById('performanceTime1');
            if (perfElement) {
                perfElement.innerHTML = `Grid Action Taken Time : <b>${diff.current}ms</b>`;
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
                    <Button
                        onClick={() => setSelectionSettings(s => ({ ...s, persistSelection: !s.persistSelection }))}
                        className='e-primary'
                        style={{ marginRight: '10px' }}
                    >
                        {selectionSettings.persistSelection ? 'Disable Persist Selection' : 'Enable Persist Selection'}
                    </Button>
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
                    <Button onClick={() =>  console.log('Get SelectedRowIndexes => ', gridRef.current?.getSelectedRowIndexes())} className='e-primary' style={{ marginRight: '10px' }}>
                        Get SelectedRowIndexes
                    </Button>
                    <Button onClick={() =>  console.log('Get SelectedRowState => ', gridRef.current?.selectionModule?.selectedRowState)} className='e-primary' style={{ marginRight: '10px' }}>
                        Get SelectedRowState
                    </Button>
                    <Button onClick={() => gridRef.current?.selectRows([1, 3])} className='e-primary' style={{ marginRight: '10px' }}>
                        Select Rows
                    </Button>
                    <Button onClick={() => gridRef?.current?.clearSelection()} className='e-primary' style={{ marginRight: '10px' }}>
                        Clear Selection
                    </Button>
                    <Button onClick={() => gridRef?.current?.refresh()} className='e-primary' style={{ marginRight: '10px' }}>
                        Refresh
                    </Button>
                </div>

                <div style={{ margin: '10px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>Data Source:</span>
                    <Button onClick={() => switchMode('local')} >Local</Button>
                    <Button onClick={() => switchMode('webapi')} >Web API</Button>
                    <Button onClick={() => switchMode('odata')} >OData V4</Button>

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
                        <p id='performanceTime1' style={{ margin: 0 }}></p>
                    </div>
                )}

                {flag && (
                    <Grid
                        key={`${dataMode}-${selectionSettings.persistSelection ? 'persist' : 'nopersist'}`}
                        dataSource={currentDataSource}
                        ref={gridRef}
                        selectionSettings={selectionSettings}
                        onGridRenderStart={onGridRenderStart}
                        onDataLoad={onDataLoad}
                        editSettings={editSettings}
                        toolbar={toolbarSettings}
                        query = {new Query().skip(0).take(500)}
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

                        // For performance checking
                        onPageChangeStart={onActionBegin}
                        onFilterStart={onActionBegin}
                        onSortStart={onActionBegin}
                        onRowAddStart={onActionBegin}
                        onDataChangeStart={onActionBegin}
                        onRefreshStart={onActionBegin}
                        onSearchStart={onActionBegin}
                        
                        onPageChange={onActioncomplete}
                        onFilter={onActioncomplete}
                        onSort={onActioncomplete}
                        onFormRender={onActioncomplete}
                        onDataChangeComplete={onActioncomplete}
                        onRefresh={onActioncomplete}
                        onSearch={onActioncomplete}
                    >
                        <Columns>
                            <Column type='checkbox' width='40'></Column>
                            <Column field='OrderID' headerText='Order ID' width='90' textAlign={TextAlign.Right} isPrimaryKey={true}></Column>
                            <Column field='CustomerID' headerText='Customer ID' width='120'></Column>
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
