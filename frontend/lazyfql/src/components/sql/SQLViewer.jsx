function SQLViewer({ sql }) {
  return (
    <pre className="overflow-x-auto p-5 font-mono text-sm leading-7 text-[#ddc58e]">
{sql}
    </pre>
  );
}

export default SQLViewer;