export default async function InvoicePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div>
      <h1>Preview — Invoice {id}</h1>
    </div>
  )
}
