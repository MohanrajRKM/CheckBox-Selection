import { useRef, useState } from 'react';
import { Provider } from '@syncfusion/react-base';
import { Grid, Column, Columns, TextAlign, type GridRef } from '@syncfusion/react-grid';
import { Button } from '@syncfusion/react-buttons';
import { generateDynamicData } from '../orderDetails';

const COUNTS = [500, 750, 1000, 1500, 2000, 5000, 10000];

export default function PerformanceTest() {
  const gridRef = useRef<GridRef>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [count, setCount] = useState<number>(COUNTS[0]);
  const [data, setData] = useState<any[]>(generateDynamicData(COUNTS[0]));

  const stTime = useRef(0);
  const edTime = useRef(0);
  const diff = useRef(0);

  const onGridRenderStart = () => {
    stTime.current = performance.now();
  };

  const onDataLoad = () => {
    edTime.current = performance.now();
    diff.current = parseInt((edTime.current - stTime.current).toFixed(0));
    const perfElement = document.getElementById('initialPerfTime');
    if (perfElement) {
      perfElement.innerHTML = `Time Taken for Initial Load: <b>${diff.current}ms</b>`;
    }
    stTime.current = 0;
    edTime.current = 0;
    diff.current = 0;
  };

  const regenerate = (next: number) => {
    setCount(next);
    setData(generateDynamicData(next));
  };

  return (
    <div style={{ margin: '10px' }}>
      <Provider ripple={true}>
        <h3 style={{ margin: '10px 10px 4px' }}>Initial render performance (no paging)</h3>

        <div style={{ margin: '10px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <label htmlFor="recCount">Records</label>
          <select
            id="recCount"
            value={count}
            onChange={(e) => regenerate(Number(e.target.value))}
            style={{ minWidth: 120 }}
          >
            {COUNTS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <Button onClick={() => setMounted(true)} className='e-primary'>Render Grid</Button>
          <Button onClick={() => setMounted(false)} className='e-primary'>Destroy Grid</Button>

          <p id='initialPerfTime' style={{ margin: 0, marginLeft: 16 }}></p>
        </div>

        {mounted && (
          <Grid
            dataSource={data}
            ref={gridRef}
            onGridRenderStart={onGridRenderStart}
            onDataLoad={onDataLoad}
            // Disable paging explicitly
            pageSettings={{ enabled: false }}
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
