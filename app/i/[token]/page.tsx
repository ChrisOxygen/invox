export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return (
    <div>
      <h1>Invoice — {token}</h1>
    </div>
  )
}
