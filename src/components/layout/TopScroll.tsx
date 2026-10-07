export function TopScroll({ text }: { text: string }) {
  return (
    <div className="bg-[#feea8a] py-2">
      <p className="text-black text-xs font-semibold text-center px-4">
        {text}
      </p>
    </div>
  );
}
