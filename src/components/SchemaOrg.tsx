type JsonLd = Record<string, unknown>

interface Props {
  schema: JsonLd | JsonLd[]
}

export function SchemaOrg({ schema }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
