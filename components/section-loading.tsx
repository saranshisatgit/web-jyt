import { Spinner } from "./spinner";

export function SectionLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size="lg" />
    </div>
  );
}