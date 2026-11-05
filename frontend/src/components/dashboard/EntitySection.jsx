import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Database,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  List,
  Table2,
  X,
} from 'lucide-react';

import Spinner from '../common/Spinner.jsx';
import EntityForm from './EntityForm.jsx';
import { getCached, hasCached } from '../../services/queryCache.js';

const EntitySection = ({
  title,
  description,
  service,
  fields,
  renderSummary,
  emptyLabel,
  layout = 'list',
}) => {
  const [items, setItems] = useState(() => getCached(service.cacheKey) || []);
  const hasVisibleData = useRef(hasCached(service.cacheKey));
  const [loading, setLoading] = useState(() => !hasCached(service.cacheKey));
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [view, setView] = useState(() => {
    try {
      const saved = localStorage.getItem(`${service.cacheKey}:view`);
      return ['grid', 'list', 'table'].includes(saved) ? saved : layout;
    } catch { return layout; }
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isGrid = view === 'grid';
  const isTable = view === 'table';
  const tableFields = useMemo(
    () => fields.filter((field) => !['textarea', 'tags'].includes(field.type)).slice(0, 6),
    [fields]
  );
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const visibleItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const changeView = (nextView) => {
    setView(nextView);
    setPage(1);
    try { localStorage.setItem(`${service.cacheKey}:view`, nextView); } catch { /* Preferences are optional. */ }
  };

  const displayCell = (item, field) => {
    const value = item[field.name];
    if (field.type === 'checkbox') return value ? 'Yes' : 'No';
    if (value === undefined || value === null || value === '') return '—';
    if (Array.isArray(value)) return value.join(', ') || '—';
    if (field.type === 'date' && value) return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value).replaceAll('-', ' ');
  };

  const load = useCallback(async () => {
    if (!hasVisibleData.current) setLoading(true);

    try {
      const data = await service.list();
      setItems(data);
      hasVisibleData.current = true;
    } catch (err) {
      if (!hasVisibleData.current) {
        toast.error(err.response?.data?.message || 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      if (editing) {
        await service.update(editing._id, values);

        toast.success(`${title} entry updated`);
      } else {
        await service.create(values);

        toast.success(`${title} entry added`);
      }

      setModalOpen(false);
      setEditing(null);

      await load();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Something went wrong';

      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (
      !window.confirm(
        'Delete this entry? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await service.remove(item._id);

      toast.success('Deleted');

      await load();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to delete'
      );
    }
  };

  return (
    <div className="entity-section w-full">

      {/* =====================================================
          SECTION HEADER
      ===================================================== */}
      <div className="flex flex-col gap-5 border-b border-gray-100 px-6 pb-6 pt-6 sm:px-7 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink shadow-lg shadow-ink/10">
            <Database
              size={19}
              className="text-gold"
            />
          </div>

          <div>

            <div className="mb-1 flex items-center gap-2">

              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                Profile Data
              </span>

              <span className="h-1 w-1 rounded-full bg-gold" />

              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                {items.length}{' '}
                {items.length === 1 ? 'Record' : 'Records'}
              </span>

            </div>

            {title && (
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1 max-w-xl text-sm leading-6 text-muted">
                {description}
              </p>
            )}

          </div>

        </div>

        {/* =====================================================
            ADD BUTTON
        ===================================================== */}
        <button
          type="button"
          onClick={openCreate}
          className="
            group
            inline-flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-ink
            px-5
            py-3
            text-sm
            font-medium
            text-white
            shadow-lg
            shadow-ink/10
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-black
            hover:shadow-xl
            sm:w-auto
          "
        >
          <Plus
            size={17}
            className="text-gold transition-transform duration-200 group-hover:rotate-90"
          />

          <span>
            Add {title?.replace(/s$/, '') || 'Entry'}
          </span>
        </button>

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="p-5 sm:p-7">

        {!loading && items.length > 0 && (
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">
              Showing <span className="font-semibold text-ink">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, items.length)}</span> of <span className="font-semibold text-ink">{items.length}</span> records
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1" role="group" aria-label="Record view">
                {[
                  { id: 'grid', label: 'Cards', Icon: LayoutGrid },
                  { id: 'list', label: 'List', Icon: List },
                  { id: 'table', label: 'Table', Icon: Table2 },
                ].map(({ id, label, Icon }) => (
                  <button key={id} type="button" onClick={() => changeView(id)} aria-pressed={view === id} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-semibold transition sm:px-3 ${view === id ? 'bg-white text-ink shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-ink'}`}>
                    <Icon size={13} /> <span>{label}</span>
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-[10px] text-muted">
                Rows
                <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs text-ink outline-none focus:border-gold">
                  {[10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            </div>
          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}
        {loading ? (

          <div className="flex min-h-[240px] items-center justify-center">

            <div className="flex flex-col items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
                <Spinner />
              </div>

              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Loading records
              </p>

            </div>

          </div>

        ) : items.length === 0 ? (

          /* =================================================
             PREMIUM EMPTY STATE
          ================================================= */
          <div className="relative overflow-hidden rounded-[22px] border border-dashed border-gray-200 bg-gradient-to-br from-gray-50/80 via-white to-gold/[0.04]">

            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />

            <div className="relative flex flex-col items-center px-6 py-14 text-center">

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-ink shadow-xl shadow-ink/10">
                <Sparkles
                  size={24}
                  className="text-gold"
                />
              </div>

              <span className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
                Your profile starts here
              </span>

              <h3 className="font-display text-xl font-semibold text-ink">
                No {title?.toLowerCase()} yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                {emptyLabel}
              </p>

              <button
                type="button"
                onClick={openCreate}
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-ink
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-white
                  shadow-lg
                  shadow-ink/10
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-black
                "
              >
                <Plus
                  size={17}
                  className="text-gold"
                />

                Add your first entry
              </button>

            </div>

          </div>

        ) : isTable ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-200/80 bg-white">
            <table className="min-w-full divide-y divide-gray-100 text-left">
              <thead className="bg-gray-50/80">
                <tr>
                  {tableFields.map((field) => <th key={field.name} scope="col" className="whitespace-nowrap px-4 py-3 font-mono text-[9px] font-semibold uppercase tracking-wider text-gray-500">{field.label}</th>)}
                  <th scope="col" className="px-4 py-3 text-right font-mono text-[9px] font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleItems.map((item) => (
                  <tr key={item._id} className="transition hover:bg-amber-50/30">
                    {tableFields.map((field) => <td key={field.name} title={displayCell(item, field)} className="max-w-[260px] truncate px-4 py-3.5 text-xs capitalize text-gray-700">{displayCell(item, field)}</td>)}
                    <td className="whitespace-nowrap px-4 py-2 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button type="button" onClick={() => openEdit(item)} title="Edit" aria-label="Edit record" className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition hover:bg-ink hover:text-white"><Pencil size={13} /></button>
                        <button type="button" onClick={() => handleDelete(item)} title="Delete" aria-label="Delete record" className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* =================================================
             RECORDS

             LIST:
             - 1 column

             GRID:
             - 1 column mobile
             - 2 columns tablet
             - 3 columns desktop
          ================================================= */
          <div
            className={
              isGrid
                ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'
                : 'space-y-3'
            }
          >

            {visibleItems.map((item, index) => (

              <div
                key={item._id}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[20px]
                  border
                  border-gray-200/80
                  bg-white
                  transition-all
                  duration-300
                  hover:border-gray-300
                  hover:shadow-[0_15px_45px_rgba(15,23,42,0.07)]
                  ${
                    isGrid
                      ? 'flex h-full min-h-[190px] flex-col p-5 hover:-translate-y-1'
                      : 'p-5 hover:-translate-y-0.5 sm:p-6'
                  }
                `}
              >

                {/* =================================================
                    GOLD HOVER ACCENT
                ================================================= */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    top-0
                    w-1
                    bg-gold
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />

                {/* =================================================
                    CARD CONTENT
                ================================================= */}
                <div
                  className={
                    isGrid
                      ? 'flex flex-1 flex-col'
                      : 'flex items-start gap-4'
                  }
                >

                  {/* Summary */}
                  <div
                    className={
                      isGrid
                        ? 'min-w-0 flex-1'
                        : 'min-w-0 flex-1'
                    }
                  >
                    {renderSummary(item)}
                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}
                  <div
                    className={
                      isGrid
                        ? 'mt-5 flex items-center justify-between border-t border-gray-100 pt-3'
                        : 'flex shrink-0 items-center gap-1'
                    }
                  >

                    {isGrid && (
                      <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-gray-300">
                        Record {String((page - 1) * pageSize + index + 1).padStart(2, '0')}
                      </span>
                    )}

                    <div className="flex items-center gap-1">

                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        title="Edit"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          text-gray-400
                          transition-all
                          hover:bg-ink
                          hover:text-white
                        "
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        title="Delete"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          text-gray-400
                          transition-all
                          hover:bg-red-50
                          hover:text-red-600
                        "
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    LIST MODE FOOTER
                ================================================= */}
                {!isGrid && (
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">

                    <span className="font-mono text-[9px] uppercase tracking-widest text-gray-300">
                      Record {String((page - 1) * pageSize + index + 1).padStart(2, '0')}
                    </span>

                    <ChevronRight
                      size={13}
                      className="text-gray-300 transition-transform group-hover:translate-x-1"
                    />

                  </div>
                )}

              </div>

            ))}

          </div>

        )}

        {!loading && items.length > 0 && (
          <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-muted">Page <span className="font-semibold text-ink">{page}</span> of <span className="font-semibold text-ink">{pageCount}</span></p>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={14} /> Previous</button>
              <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={14} /></button>
            </div>
          </div>
        )}

      </div>

      {/* =====================================================
          PREMIUM MODAL
      ===================================================== */}
      {modalOpen && createPortal(
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-ink/60
            overflow-y-auto
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >

          <div
            className="
              relative
              my-auto
              max-h-[min(92vh,900px)]
              w-full
              max-w-2xl
              overflow-hidden
              rounded-[28px]
              border
              border-white/40
              bg-white/90
              shadow-[0_35px_100px_rgba(0,0,0,0.3)]
              backdrop-blur-2xl
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="entity-modal-title"
          >

            {/* =================================================
                GOLD ACCENT
            ================================================= */}
            <div className="h-1.5 w-full bg-gold" />

            {/* =================================================
                MODAL HEADER
            ================================================= */}
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 sm:px-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink">
                  <Sparkles
                    size={18}
                    className="text-gold"
                  />
                </div>

                <div>

                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                    {editing
                      ? 'Update Record'
                      : 'New Record'}
                  </div>

                  <h3 id="entity-modal-title" className="mt-0.5 font-display text-xl font-semibold text-ink">
                    {editing
                      ? `Edit ${title}`
                      : `Add ${title}`}
                  </h3>

                </div>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  text-gray-400
                  transition-colors
                  hover:bg-gray-100
                  hover:text-ink
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <X size={18} />
              </button>

            </div>

            {/* =================================================
                FORM
            ================================================= */}
            <div className="max-h-[calc(min(92vh,900px)-100px)] overflow-y-auto px-6 py-6 sm:px-7">

              <div className="mb-5 rounded-2xl border border-gold/20 bg-gold/[0.055] px-4 py-3">

                <div className="flex items-start gap-3">

                  <Sparkles
                    size={15}
                    className="mt-0.5 shrink-0 text-gold"
                  />

                  <p className="text-xs leading-5 text-muted">
                    Keep your information clear and relevant. This data can
                    be used across your portfolio and ATS resume.
                  </p>

                </div>

              </div>

              <EntityForm
                fields={fields}
                initialValues={editing || {}}
                onSubmit={handleSubmit}
                onCancel={closeModal}
                submitting={submitting}
              />

            </div>

          </div>

        </div>,
        document.body
      )}

    </div>
  );
};

export default EntitySection;
