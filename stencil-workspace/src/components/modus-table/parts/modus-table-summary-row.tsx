import {
  FunctionalComponent,
  h, // eslint-disable-line @typescript-eslint/no-unused-vars
} from '@stencil/core';
import { Header, HeaderGroup } from '@tanstack/table-core';
import { PropertyDataType, PropertyShowTotal } from '../constants/constants';
import { ModusTableColumnDataType } from '../enums';
import ModusTableDisplayOptions from '../models/modus-table-display-options';

interface ModusTableSummaryRowProps {
  footerGroups: HeaderGroup<unknown>[];
  tableData: unknown[];
  borderlessOptions: ModusTableDisplayOptions;
  frozenColumns: string[];
}

function calculateSum(tableData: unknown[], header: Header<unknown, unknown>): number | string {
  let sum = 0;
  tableData.map((rowData) => (sum += Number(rowData[header.column.columnDef['accessorKey']])));
  return !isNaN(sum) ? sum : '';
}

export const ModusTableSummaryRow: FunctionalComponent<ModusTableSummaryRowProps> = ({
  footerGroups,
  tableData,
  borderlessOptions,
  frozenColumns,
}) => {
  const borderLessTableStyle = (borderlessOptions?.cellBorderless || borderlessOptions?.borderless) && { boxShadow: 'none' };
  return (
    <tfoot>
      {footerGroups.map((group) => (
        <tr class="summary-row" style={borderLessTableStyle}>
          {group.headers.map((header) => (
            <td
              key={header.id}
              class={`
                ${frozenColumns.includes(header.id) ? 'sticky-left' : ''}
                ${header.column.columnDef[PropertyDataType] === ModusTableColumnDataType.Integer ? 'text-align-right' : ''}
              `}>
              {header.column.columnDef[PropertyShowTotal] ? calculateSum(tableData, header) : header.column.columnDef.footer}
            </td>
          ))}
        </tr>
      ))}
    </tfoot>
  );
};