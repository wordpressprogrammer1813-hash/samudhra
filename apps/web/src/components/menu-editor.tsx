'use client';

import { useState, useTransition, type FormEvent } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  addMenuItem,
  deleteMenuItem,
  reorderMenuItems,
  updateMenuItem,
} from '@/app/admin/(protected)/menu/actions';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { MenuItemNode } from '@/lib/menus';

function DragHandle(props: Record<string, unknown>) {
  return (
    <button
      type="button"
      {...props}
      className="grid size-8 shrink-0 cursor-grab place-items-center text-heath/40 active:cursor-grabbing"
      aria-label="Drag to reorder"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <circle cx="9" cy="6" r="1.4" />
        <circle cx="15" cy="6" r="1.4" />
        <circle cx="9" cy="12" r="1.4" />
        <circle cx="15" cy="12" r="1.4" />
        <circle cx="9" cy="18" r="1.4" />
        <circle cx="15" cy="18" r="1.4" />
      </svg>
    </button>
  );
}

function ItemForm({
  initialLabel = '',
  initialLink = '',
  pending,
  onSubmit,
  onCancel,
}: {
  initialLabel?: string;
  initialLink?: string;
  pending: boolean;
  onSubmit: (label: string, link: string) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initialLabel);
  const [link, setLink] = useState(initialLink);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(label, link);
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-3 py-2">
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label"
        required
        autoFocus
        className="rounded-[3px] border border-heath/30 bg-transparent px-3 py-2 text-sm text-heath outline-none focus-visible:border-heath"
      />
      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Link (e.g. /menu or #contact)"
        className="rounded-[3px] border border-heath/30 bg-transparent px-3 py-2 text-sm text-heath outline-none focus-visible:border-heath"
      />
      <button
        type="submit"
        disabled={pending}
        aria-label="Save"
        className="grid size-8 place-items-center text-heath disabled:opacity-50"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-4"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onCancel}
        aria-label="Cancel"
        className="grid size-8 place-items-center text-heath/50 hover:text-red-700"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="size-4"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </form>
  );
}

function ItemRow({
  item,
  menuId,
  onAddSubItem,
}: {
  item: MenuItemNode;
  menuId: string;
  onAddSubItem?: (parentId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, startTransition] = useTransition();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  if (editing) {
    return (
      <div ref={setNodeRef} style={style} className="px-5">
        <ItemForm
          initialLabel={item.label}
          initialLink={item.link}
          pending={pending}
          onCancel={() => setEditing(false)}
          onSubmit={(label, link) =>
            startTransition(async () => {
              await updateMenuItem({ id: item.id, menuId, label, link });
              setEditing(false);
            })
          }
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-1 border-b border-heath/10 pr-3 pl-1 last:border-b-0"
    >
      <DragHandle {...attributes} {...listeners} />
      <div className="py-3">
        <p className="text-sm text-heath">{item.label}</p>
        {item.link ? <p className="text-xs text-heath/50">{item.link}</p> : null}
        {onAddSubItem ? (
          <button
            type="button"
            onClick={() => onAddSubItem(item.id)}
            className="mt-1 text-xs tracking-[0.1em] text-heath/50 uppercase hover:text-zest"
          >
            + Add sub-item
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label="Edit"
        className="grid size-8 place-items-center text-heath/50 hover:text-heath"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="size-4"
        >
          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => setConfirmingDelete(true)}
        aria-label="Delete"
        className="grid size-8 place-items-center text-heath/50 hover:text-red-700 disabled:opacity-50"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="size-4"
        >
          <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
        </svg>
      </button>
      <ConfirmDialog
        open={confirmingDelete}
        title={`Delete "${item.label}"?`}
        description={
          item.children.length > 0
            ? `This also deletes its ${item.children.length} sub-item${item.children.length > 1 ? 's' : ''}. This can't be undone.`
            : "This can't be undone."
        }
        pending={pending}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => startTransition(() => deleteMenuItem(item.id, menuId))}
      />
    </div>
  );
}

export function MenuEditor({ menuId, items }: { menuId: string; items: MenuItemNode[] }) {
  const [tree, setTree] = useState(items);
  // Re-sync with the server after any add/edit/delete (revalidatePath causes
  // Next.js to re-render this page with fresh `items`). Plain useState only
  // takes its initial value from props, so without this the list would keep
  // showing stale data after every mutation except drag-reorder — adjusting
  // state during render (not in an effect) avoids the extra render pass.
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setTree(items);
  }
  const [addingUnder, setAddingUnder] = useState<string | 'root' | null>(null);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function siblingGroupOf(id: string): { parentId: string | null; ids: string[] } | null {
    const topIds = tree.map((n) => n.id);
    if (topIds.includes(id)) return { parentId: null, ids: topIds };
    for (const top of tree) {
      const childIds = top.children.map((c) => c.id);
      if (childIds.includes(id)) return { parentId: top.id, ids: childIds };
    }
    return null;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeGroup = siblingGroupOf(String(active.id));
    const overGroup = siblingGroupOf(String(over.id));
    if (!activeGroup || !overGroup || activeGroup.parentId !== overGroup.parentId) return;

    const oldIndex = activeGroup.ids.indexOf(String(active.id));
    const newIndex = activeGroup.ids.indexOf(String(over.id));
    const reordered = arrayMove(activeGroup.ids, oldIndex, newIndex);

    setTree((prev) => {
      if (activeGroup.parentId === null) {
        const byId = new Map(prev.map((n) => [n.id, n]));
        return reordered.map((id) => byId.get(id)!);
      }
      return prev.map((top) => {
        if (top.id !== activeGroup.parentId) return top;
        const byId = new Map(top.children.map((n) => [n.id, n]));
        return { ...top, children: reordered.map((id) => byId.get(id)!) };
      });
    });

    startTransition(() => reorderMenuItems(menuId, reordered));
  }

  const [pending, startAddTransition] = useTransition();

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="rounded-[3px] border border-heath/15">
          <SortableContext items={tree.map((n) => n.id)} strategy={verticalListSortingStrategy}>
            {tree.map((top) => (
              <div key={top.id}>
                <ItemRow item={top} menuId={menuId} onAddSubItem={(id) => setAddingUnder(id)} />
                {top.children.length > 0 ? (
                  <div className="bg-heath/[0.02] pl-8">
                    <SortableContext
                      items={top.children.map((n) => n.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {top.children.map((child) => (
                        <ItemRow key={child.id} item={child} menuId={menuId} />
                      ))}
                    </SortableContext>
                  </div>
                ) : null}
                {addingUnder === top.id ? (
                  <div className="bg-heath/[0.02] pl-16">
                    <ItemForm
                      pending={pending}
                      onCancel={() => setAddingUnder(null)}
                      onSubmit={(label, link) =>
                        startAddTransition(async () => {
                          await addMenuItem({ menuId, parentId: top.id, label, link });
                          setAddingUnder(null);
                        })
                      }
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {addingUnder === 'root' ? (
        <div className="mt-3 rounded-[3px] border border-heath/15 px-5">
          <ItemForm
            pending={pending}
            onCancel={() => setAddingUnder(null)}
            onSubmit={(label, link) =>
              startAddTransition(async () => {
                await addMenuItem({ menuId, parentId: null, label, link });
                setAddingUnder(null);
              })
            }
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddingUnder('root')}
          className="mt-4 text-sm font-medium tracking-[0.1em] text-heath uppercase hover:text-zest"
        >
          + Add menu item
        </button>
      )}
    </div>
  );
}
