import { useRef, useState } from 'react';
import { Provider } from '@syncfusion/react-base';
import { Grid, Column, Columns, type GridRef, TextAlign, type EditSettings, type PageSettings, type SortSettings, type FilterSettings, type SearchSettings } from '@syncfusion/react-grid';
import { Button } from '@syncfusion/react-buttons';
import { generateDynamicData } from '../orderDetails';

export default function PersistLocalDemo() {
  const gridRef = useRef<GridRef>(null);
  const [localData] = useState(generateDynamicData(200));

  const [selectionSettings, setSelectionSettings] = useState<any>({
    enabled: true,
    mode: 'Multiple',
    headerCheckbox: true,
    persistSelection: false,
  });

  const [flag, setFlag] = useState(false);
  const [filterSettings] = useState<FilterSettings>({ enabled: true });
  const [sortSettings] = useState<SortSettings>({ enabled: true });
  const [pageSettings] = useState<PageSettings>({ enabled: true, pageSize: 10, pageCount: 4, totalRecordsCount: localData.length });
  const [editSettings] = useState<EditSettings>({ allowEdit: false, allowAdd: false, allowDelete: true });
  const [toolbarSettings] = useState<string[]>(['Search']);
  const [searchSettings] = useState<SearchSettings>({ enabled: true });

  return (
    <div style={{ margin: '10px' }}>
      <Provider ripple={true}>
        <h2 style={{ margin: '10px' }}>Persist selection - Local data</h2>

        <div style={{ margin: '10px' }}>
          <Button onClick={() => setSelectionSettings((s: any) => ({ ...s, persistSelection: !s.persistSelection }))} className='e-primary' style={{ marginRight: '10px' }}>
            {selectionSettings.persistSelection ? 'Disable Persistence' : 'Enable Persistence'}
          </Button>
          <Button onClick={() => (gridRef as any).current?.clearSelection()} className='e-primary' style={{ marginRight: '10px' }}>
            Clear Selection
          </Button>
          <Button onClick={() => setFlag(true)} className='e-primary' style={{ marginRight: '10px', marginBottom: '10px' }}>
            Render Grid
          </Button>
          <Button onClick={() => setFlag(false)} className='e-primary' style={{ marginRight: '10px' }}>
            Destroy Grid
          </Button>
        </div>

        {flag && (
          <Grid
            dataSource={localData}
            ref={gridRef}
            selectionSettings={selectionSettings}
            editSettings={editSettings}
            toolbar={toolbarSettings}
            filterSettings={filterSettings}
            sortSettings={sortSettings}
            pageSettings={pageSettings}
            searchSettings={searchSettings}
          >
            <Columns>
              <Column type='checkbox' width='40'></Column>
              {/* Primary key is required for persistSelection */}
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
