import { Button } from "@mantine/core";

type Props = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyTip({
  title = "No content yet",
  message = "Enter an App ID and click Submit to load game details.",
  actionLabel = "blabla",
  onAction,
}: Props) {
  return (
    <div className="flex items-center justify-center min-h-[220px] bg-gradient-to-br from-[rgba(15,23,42,0.03)] to-[rgba(99,102,241,0.02)] rounded-lg p-7 text-gray-700">
      <div className="text-center max-w-[520px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-16 h-16 text-gray-500 mx-auto mb-3"
          aria-hidden
        >
          <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" strokeOpacity="0.12" />
          <path d="M8.5 9.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
          <path
            d="M21 21l-4.35-4.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3>{title}</h3>
        <p className="text-gray-600 my-2 mb-3.5">{message}</p>
        {onAction ? (
          <Button size="xs" variant="light" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
