import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  SortingState,
  ColumnResizeMode,
} from '@tanstack/react-table';
import { Task } from '@packages/types/shared';
import { cn } from '@packages/ui/utils';
import { formatTaskDate } from '@packages/core/logic';
import { PRIORITY_WEIGHTS } from '@packages/core/config';
import { UI_MESSAGES } from '@packages/types/messages';
import { ArrowUp, ArrowDown, ArrowUpDown, Check, Trash2, ArchiveRestore, NotepadText } from 'lucide-react';
import { Badge } from '@packages/ui/Badge';
import { Tooltip } from '@packages/ui/Tooltip';
import { ScrollContainer } from '@packages/ui/ScrollContainer';
import { usePlan } from '@packages/storage/PlanContext';
import Linkify from "linkify-react";

// --------------------------------------------------------------------------
// Component: TableView
// --------------------------------------------------------------------------

const columnHelper = createColumnHelper<Task>();

// Linkify options (Auto-detect linkable text)
const linkifyOptions = {target: "_blank", rel: "noopener noreferrer", className: "underline"};

export function TableView() {
  const { 
    tasks: allTasks, 
    config, 
    currentScope: scope, 
    confirm: confirmRequest, 
    taskActions 
  } = usePlan();

  const customFields = config.customFields;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');

  const tasks = useMemo(() => {
    return allTasks
      .filter(task => {
        if (!task) return false;
        return scope === 'archived' ? !!task.archived : !task.archived;
      })
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  }, [allTasks, scope]);

/* -------------------------------------------------------------------------- */
/* Table Definition: Columns and Metadata                                   */
/* -------------------------------------------------------------------------- */

  const columns = useMemo(() => [
    columnHelper.accessor('title', {
      header: 'Task',
      size: 240,
      cell: info => (
        <div className="flex items-center min-w-0">
          <span className="flex w-full items-center min-w-0 text-[12px] text-text-primary group-hover:text-accent transition-colors">
            
            <div className="truncate">
              <Linkify options={linkifyOptions}>
                {info.getValue()}
              </Linkify>
            </div>

            {info.row.original.content && (
              <div className='relative group/notes flex-none'>
                <NotepadText className="w-3 h-3 ml-1 text-text-primary/80 group-hover:text-accent" />
                <div className='z-100 absolute hidden m-0.5 shadow-lg px-2 py-1 w-max max-w-[60dvw] whitespace-pre-line rounded-md  bg-text-primary text-bg border border-border group-hover/notes:block'>
                  <p className='font-semibold'>Notes:</p>
                  <Linkify options={linkifyOptions}>
                    {info.row.original.content}
                  </Linkify>
                </div>
              </div>
            )}
          </span>

          <div className="hidden h-5 ml-4 gap-1 group-hover:flex shrink-0">
            
            {/* Action: Complete */}
            {!info.row.original.archived && (
              <Tooltip content="Complete task" position="left">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    taskActions.archive(info.row.original);
                  }}
                  className="p-1 rounded hover:bg-priority-low/10 text-text-secondary hover:text-priority-low transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            )}
            {/* Action: Restore */}
            {info.row.original.archived && (
              <Tooltip content="Restore task" position="left">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    taskActions.restore(info.row.original);
                  }}
                  className="p-1 rounded hover:bg-accent/10 text-text-secondary hover:text-accent transition-colors"
                >
                  <ArchiveRestore className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            )}
            {/* Action: Delete */}
            <Tooltip content="Delete permanently" position="left">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirmed = await confirmRequest({
                    title: UI_MESSAGES.CONFIRMATIONS.DELETE_TASK.title,
                    message: UI_MESSAGES.CONFIRMATIONS.DELETE_TASK.message(info.row.original.title),
                    confirmLabel: UI_MESSAGES.CONFIRMATIONS.DELETE_TASK.confirmLabel,
                    variant: 'danger'
                  });
                  if (confirmed) {
                    taskActions.delete(info.row.original.id);
                  }
                }}
                className="p-1 rounded hover:bg-priority-high/10 text-text-secondary hover:text-priority-high transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      sortingFn: (rowA, rowB) => {
        const options = customFields.find(f => f.id === 'status')?.options || [];
        const indexA = options.findIndex(o => o.id === rowA.original.status);
        const indexB = options.findIndex(o => o.id === rowB.original.status);
        return indexA - indexB;
      },
      cell: info => {
        const val = info.getValue();
        const statusField = customFields.find(f => f.id === 'status');
        const option = statusField?.options?.find(o => o.id === val);
        return (
          <Badge variant="option" optionColor={option?.color} className="whitespace-nowrap">
            {option?.label || val}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      sortingFn: (rowA, rowB) => {
        const a = PRIORITY_WEIGHTS[rowA.original.priority] || 0;
        const b = PRIORITY_WEIGHTS[rowB.original.priority] || 0;
        return a - b;
      },
      cell: info => {
        const p = info.getValue();
        if (!p) return null;
        return (
          <div className="flex items-center gap-1.5 font-medium text-[12px] text-text-secondary">
            <div className={cn(
              "w-2 h-2 rounded-full shrink-0",
              p === 'High' ? "bg-priority-high" :
              p === 'Medium' ? "bg-priority-med" :
              p === 'Low' ? "bg-priority-low" :
              "bg-priority-unassigned"
            )} />
            <span>{p}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('dueDate', {
      header: 'Due',
      size: 120,
      cell: info => {
        const val = info.getValue() || '';
        if (!val) return null;
        const { text, colorClass } = formatTaskDate(val, info.row.original.archived);
        return (
          <div className={cn("flex whitespace-nowrap items-center gap-1.5 text-[12px]", colorClass || "text-text-secondary")}>
            {text}
          </div>
        );
      },
    }),
    columnHelper.accessor('tags', {
      header: 'Tags',
      sortingFn: (rowA, rowB) => {
        const a = (rowA.original.tags || []).join(', ');
        const b = (rowB.original.tags || []).join(', ');
        return a.localeCompare(b);
      },
      cell: info => {
        const tags = info.getValue();
        if (!Array.isArray(tags)) return null;
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        );
      },
    }),
    ...(Array.isArray(customFields) ? customFields : []).filter(f => f && f.id && f.id !== 'status').map(field => 
      columnHelper.accessor(field.id as any, {
        header: field.label,
        sortingFn: (rowA, rowB) => {
          const valA = rowA.original[field.id];
          const valB = rowB.original[field.id];
          if (!valA && !valB) return 0;
          if (!valA) return 1;
          if (!valB) return -1;

          if (field.type === 'select') {
            const options = field.options || [];
            const indexA = options.findIndex(o => o.id === valA);
            const indexB = options.findIndex(o => o.id === valB);
            return indexA - indexB;
          }
          return String(valA).localeCompare(String(valB));
        },
        cell: info => {
          const val = info.getValue();
          if (!val) return null;
          if (field.type === 'select') {
            const option = field.options?.find(o => o.id === val);
            return (
              <Badge variant="option" optionColor={option?.color}>
                {option?.label || String(val)}
              </Badge>
            );
          }
          return <span className="text-[12px] text-text-secondary">{String(val)}</span>;
        }
      })
    )
  ], [customFields, taskActions]);

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
      columnOrder: config.tableView?.columnOrder || [],
      columnVisibility: config.tableView?.columnVisibility || {},
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
  });

  return (
      <ScrollContainer>

        <table 
          className="w-full text-left border-collapse table-fixed"
          style={{ minWidth: table.getCenterTotalSize() }}
        >

          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="sticky top-0 z-10 bg-sidebar border-b border-border">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="relative first:pl-6 last:pr-6 px-2 py-2 text-[11px] font-bold uppercase text-text-secondary bg-sidebar hover:text-text-primary transition-colors group/header"
                    style={{ width: header.getSize() }}
                  >
                    <div 
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      
                      {/* Logic: Not sorted = UpDown, Asc = Down, Desc = Up */}
                      {!header.column.getIsSorted() && (
                        <ArrowUpDown className="w-3 h-3 shrink-0 text-text-secondary/40" />
                      )}
                      {header.column.getIsSorted() === 'asc' && (
                        <ArrowDown className="w-3 h-3 shrink-0 text-text-secondary" />
                      )}
                      {header.column.getIsSorted() === 'desc' && (
                        <ArrowUp className="w-3 h-3 shrink-0 text-text-secondary" />
                      )}
                    </div>

                    {/* Resizer */}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={cn(
                        "absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none touch-none z-20 group/resizer",
                        header.column.getIsResizing() ? "opacity-100" : "opacity-0 group-hover/header:opacity-100"
                      )}
                    >
                      <div className={cn(
                        "absolute right-[1px] top-0 h-full w-[3px] transition-colors",
                        header.column.getIsResizing() ? "bg-accent" : "bg-border group-hover/resizer:bg-accent/50"
                      )} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                onClick={() => taskActions.edit(row.original)}
                className="group border-b border-border hover:bg-sidebar cursor-pointer transition-colors"
              >
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className="first:pl-6 last:pr-6 px-2 py-2"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-text-secondary text-[13px]">No tasks found.</p>
          </div>
        )}

      </ScrollContainer>
  );
}
