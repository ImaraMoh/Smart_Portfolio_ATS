import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Database,
  ChevronRight,
  X,
} from 'lucide-react';

import Spinner from '../common/Spinner.jsx';
import EntityForm from './EntityForm.jsx';

const EntitySection = ({
  title,
  description,
  service,
  fields,
  renderSummary,
  emptyLabel,
  layout = 'list',
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isGrid = layout === 'grid';

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const data = await service.list();
      setItems(data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to load data'
      );
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
    <div className="w-full">

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

            {items.map((item, index) => (

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
                        Record {String(index + 1).padStart(2, '0')}
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
                      Record {String(index + 1).padStart(2, '0')}
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

      </div>

      {/* =====================================================
          PREMIUM MODAL
      ===================================================== */}
      {modalOpen && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-ink/60
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
              max-h-[92vh]
              w-full
              max-w-2xl
              overflow-hidden
              rounded-[28px]
              border
              border-white/10
              bg-white
              shadow-[0_35px_100px_rgba(0,0,0,0.25)]
            "
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

                  <h3 className="mt-0.5 font-display text-xl font-semibold text-ink">
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
            <div className="max-h-[calc(92vh-100px)] overflow-y-auto px-6 py-6 sm:px-7">

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

        </div>

      )}

    </div>
  );
};

export default EntitySection;
