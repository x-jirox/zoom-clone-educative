// app/(root)/meting/[id]/page.tsx
export default async function Metting({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div>
      <h1>Meting Room: #{id}</h1>
    </div>
  )
}
