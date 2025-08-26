type Props = {
  media: string
}

function Preview({ media }: Props) {
  return (
    <div className="preview mt-6">
      <img
        src={media}
        alt="Uploaded preview"
        className="max-w-lg max-h-[500px] rounded-xl shadow-lg border border-gray-800"
      />
    </div>
  )
}

export default Preview
