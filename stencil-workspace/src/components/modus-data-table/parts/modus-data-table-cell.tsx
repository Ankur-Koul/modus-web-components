import {
  FunctionalComponent,
  h, // eslint-disable-line @typescript-eslint/no-unused-vars
} from '@stencil/core';
import { Cell, Row } from '@tanstack/table-core';
import { IconChevronDownThick } from '../../icons/icon-chevron-down-thick';
import { IconChevronUpThick } from '../../icons/icon-chevron-up-thick';
import { PropertyDataType } from '../constants/constants';
import { ModusColumnDataType } from '../enums/modus-column-data-type';
import { cellFormatter } from './modus-data-table-cell-formatter';

interface ModusDataTableCellProps {
  cell: Cell<unknown, unknown>;
  row: Row<unknown>;
  cellIndex: number;
}

export const ModusDataTableCell: FunctionalComponent<
  ModusDataTableCellProps
> = ({ cell, row, cellIndex }) => {
  console.log(row);
  console.log(cell);
  return (
    <td
      key={cell.id}
      class={`
       ${
         cell.column.columnDef[PropertyDataType] === ModusColumnDataType.Integer
           ? 'text-align-right'
           : ''
       }
          ${cell.column.getIsResizing() ? 'active-resize' : ''}
      `}
      style={{ width: `${cell.column.getSize()}px` }}>
      {/* {cellIndex === 0 && row.getCanExpand() ? (
        <span
          class="expand"
          style={{ paddingLeft: `${row.depth * 1}rem` }}
          onClick={row.getToggleExpandedHandler()}>
          {row.getIsExpanded() ? (
            <IconChevronUpThick size={'24'} />
          ) : (
            <IconChevronDownThick size={'24'} />
          )}
        </span>
      ) : (
        ''
      )} */}
      <span
        class="expand"
        style={{ paddingLeft: `${row.depth * 2}rem` }}
        onClick={row.getToggleExpandedHandler()}>
        {cellIndex === 0 && row.getCanExpand() ? (
          row.getIsExpanded() ? (
            <IconChevronUpThick size={'24'} />
          ) : (
            <IconChevronDownThick size={'24'} />
          )
        ) : (
          ''
        )}
      </span>

      {cellFormatter(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};
