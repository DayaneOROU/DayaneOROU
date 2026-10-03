



type DashcardProps = {
  title: string;
  count: number;
  description: string;
  variant?: "default" | "orange" | "vert"
};

export default function Dashcard({ title, count, description, variant = "default" }: DashcardProps) {

  const stylesByVariant = {
    default: {
      title: "text-gray-700 dark:text-zinc-400",
      count: "",
      desc: " text-zinc-500 dark:text-zinc-500",
    },
    orange: {
      title: "text-amber-700 dark:text-amber-300",
      count: " text-amber-700 dark:text-amber-300",
      desc: "text-amber-800/60 dark:text-amber-200/60",
    },
    vert: {
      title: "text-emerald-700 dark:text-emerald-300",
      count: "text-emerald-700 dark:text-emerald-300",
      desc: "text-emerald-800/60 dark:text-emerald-200/60",
    },
  };

  const style = stylesByVariant[variant] || stylesByVariant.default;

  
  return (
    <div>
      <div className={`box-shadow dark:bg-white/[0.045] hover:scale-105 transition-all duration-300`}>
        <p className={`text-xs font-medium uppercase tracking-[0.16em] ${style.title} `}>
          {title}
        </p>
        <p className={`mt-3 text-3xl font-bold tracking-tightz ${style.count}`}>{count}</p>
        <p className={`mt-1 text-xs ${style.desc}`}>{description}</p>
      </div>
    </div>
  );
}
