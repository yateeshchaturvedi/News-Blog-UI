type TagChipProps = {
  children: React.ReactNode;
  active?: boolean;
};

export default function TagChip({ children, active = false }: TagChipProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
        active
          ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950"
          : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
