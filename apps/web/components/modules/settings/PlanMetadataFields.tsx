import { PlanMetadata } from '@packages/types/shared';

/**
 * --------------------------------------------------------------------------
 * Types
 * --------------------------------------------------------------------------
 */

interface PlanMetadataFieldsProps {
  metadata: PlanMetadata | null;
  onChange: (updates: Partial<PlanMetadata>) => void;
}

/**
 * --------------------------------------------------------------------------
 * Component: PlanMetadataFields
 * --------------------------------------------------------------------------
 */

export function PlanMetadataFields({ metadata, onChange }: PlanMetadataFieldsProps) {
  return (
    <section className="space-y-6">
      <div className="pb-6  space-y-2">
        <div className="flex items-center gap-6">
          <label className="w-24 shrink-0 text-[11px] font-semibold text-text-secondary uppercase">
            Plan Name
          </label>
          <input
            type="text"
            value={metadata?.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            className="flex-1 bg-bg border border-border rounded-md px-3 py-1.5 text-[13px] focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            placeholder="Enter a name (Optional)"
          />
        </div>

        <div className="flex items-start gap-6">
          <label className="w-24 shrink-0 mt-2 text-[11px] font-semibold text-text-secondary uppercase">
            Plan Notes
          </label>
          <textarea
            value={metadata?.notes || ''}
            rows={2}
            onChange={(e) => onChange({ notes: e.target.value })}
            className="flex-1 resize-y bg-bg border border-border rounded-md px-3 py-2 text-[13px] focus:ring-1 focus:ring-accent focus:border-accent outline-none resize-none"
            placeholder="Describe your plan (Optional)"
          />
        </div>
      </div>
    </section>
  );
}
