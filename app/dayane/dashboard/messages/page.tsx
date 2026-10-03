import Dashcard from "@/components/dashcard";
import { getMessages, toggleMessageRead } from "@/lib/actions/messages";
import {
  Check,
  CircleUserRound,
  Mail,
  MailOpen,
  CheckCheck,
} from "lucide-react";

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function categoryStyle(category: string) {
  switch (category) {
    case "Collaboration":
      return "bg-[#277861]/10 text-[#277861] dark:bg-emerald-400/10 dark:text-emerald-300";
    case "Freelance":
      return "bg-violet-500/10 text-violet-700 dark:text-violet-300";
    case "Question":
      return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
    default:
      return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300";
  }
}

export default async function MessagesPage() {
  const messages = await getMessages();
  const unreadCount = messages.filter((message) => !message.read).length;
  const readCount = messages.length - unreadCount;

  return (
    <main className="admin-padding min-h-screen pb-16 text-gray-900 dark:bg-[#101112] dark:text-white">
      <div className="mx-auto w-full max-w-7xl">
        {/* En-tête */}
        <div className="mb-8 sm:mb-10">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#277861] dark:text-emerald-400">
            Boîte de réception
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-inter text-4xl font-bold tracking-[-0.05em] sm:text-5xl lg:text-7xl">
                Messages
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Retrouvez les demandes reçues depuis votre portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* Cartes de synthèse */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:mb-10">
          <Dashcard
            title="Tous les messages"
            count={messages.length}
            description="messages reçus"
            variant={"default"}
          />

          <Dashcard
            title="Lus"
            count={readCount}
            description="messages consultés"
            variant="vert"
          />

          <Dashcard
            title="Non lus"
            count={unreadCount}
            description="à consulter"
            variant="orange"
          />
        </div>

        {/* Conteneur de tableau : scroll horizontal assumé sur mobile */}
        <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.035]">
          <div className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-4 sm:px-6 dark:border-white/[0.08]">
            <div>
              <h2 className="text-sm md:text-lg font-semibold">
                Tous les messages
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                {messages.length} message{messages.length > 1 ? "s" : ""} au
                total
              </p>
            </div>
            <Mail size={18} className="text-zinc-400" />
          </div>

          {messages.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#277861]/10 text-[#277861] dark:bg-emerald-400/10 dark:text-emerald-300">
                <MailOpen size={25} />
              </div>
              <p className="font-semibold">Aucun message pour le moment</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                Les messages envoyés depuis le portfolio apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-zinc-200/80 text-sm font-medium uppercase tracking-[0.16em] text-gray-600 dark:border-white/[0.08] dark:text-zinc-500">
                    <th scope="col" className="w-20 px-4 py-4 sm:px-6">
                      Profil
                    </th>
                    <th scope="col" className="px-3 py-4">
                      Expéditeur
                    </th>
                    <th scope="col" className="w-44 px-3 py-4">
                      Catégorie
                    </th>
                    <th scope="col" className="px-3 py-4">
                      Sujet
                    </th>
                    <th scope="col" className="w-36 px-3 py-4">
                      Reçu
                    </th>
                    <th scope="col" className="w-40 px-3 py-4">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.06]">
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className={`group transition-colors hover:bg-[#277861]/[0.035] dark:hover:bg-white/[0.035] ${
                        !message.read
                          ? "bg-[#277861]/[0.025] dark:bg-emerald-400/[0.025]"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#277861] to-[#163f35] text-xs font-bold text-white shadow-sm">
                          {getInitials(message.name)}
                          <CircleUserRound
                            size={13}
                            className="absolute -bottom-1 -right-1 rounded-full bg-[#163f35] p-0.5 text-white/80"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="max-w-[190px]">
                          <p
                            className={`truncate text-lg ${!message.read ? "font-bold" : "font-semibold"}`}
                          >
                            {message.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-500">
                            {message.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-base font-semibold ${categoryStyle(message.category)}`}
                        >
                          {message.category}
                        </span>
                      </td>
                      <td className="max-w-[280px] px-3 py-4">
                        <p
                          className={`truncate text-lg ${!message.read ? "font-semibold text-zinc-950 dark:text-white" : "text-zinc-700 dark:text-zinc-300"}`}
                        >
                          {message.subject}
                        </p>
                        <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-500">
                          {message.body}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-zinc-500 dark:text-zinc-500">
                        {formatDate(message.created_at)}
                      </td>
                      <td className="px-3 py-4">
                        <form
                          action={toggleMessageRead.bind(
                            null,
                            message.id,
                            !message.read,
                          )}
                        >
                          <button
                            type="submit"
                            className={`inline-flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#277861] ${
                              message.read
                                ? "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-white/[0.08] dark:hover:text-zinc-200"
                                : " text-[#277861]  dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20"
                            }`}
                          >
                            {message.read ? (
                              <CheckCheck size={18} />
                            ) : (
                              <Check size={18} />
                            )}
                            {message.read ? "Lu" : "Non lu"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
