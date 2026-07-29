interface FormMessageProps {
  type: "success" | "error";
  message: string;
}

export function FormMessage({
  type,
  message,
}: FormMessageProps) {
  const isSuccess = type === "success";

  return (
    <p
      role={isSuccess ? "status" : "alert"}
      aria-live="polite"
      className={
        isSuccess
          ? "rounded-lg border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm font-medium text-emerald-300"
          : "rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm font-medium text-red-300"
      }
    >
      {message}
    </p>
  );
}