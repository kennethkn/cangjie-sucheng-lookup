function OutputCard(props: { output: string[] }) {
  return (
    <div className="flex flex-col items-center border-2 bg-neutral-50 p-2 hover:border-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:hover:border-neutral-300">
      <p className="text-2xl font-bold">{props.output[0]}</p>
      <p className="text-sm">{props.output[1]}</p>
      <p className="font-mono">{props.output[2]}</p>
    </div>
  )
}

export default OutputCard
