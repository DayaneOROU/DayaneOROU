"use client";

import { House, FolderOpenDot, FilePen, User } from "lucide-react";

const links = [
  { label: "Accueil", href: "/", icon: House },
  { label: "Projects", href: "/projects", icon: FolderOpenDot },
  { label: "Blogs", href: "/blogs", icon: FilePen },
  { label: "Contacts", href: "/contact", icon: User },
];

export default function Navbar() {
  return (
    <>
      <nav>
        <div className="px-15 flex justify-between items-center text-gray-700 bg-gray-100">
          <div>
            <img src="/dayaneorouN.png" alt="D.O" className="w-15" />
          </div>
          <div className="flex justify-between gap-5 font-inter text-gray-700">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <a key={link.href} href={link.href} className="flex gap-1 ">
                  <Icon />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
          <div>
            <a href="" className="rounded-4xl bg-amber-100 py-2 px-3 font-bold">
              UNE IDEE DE PROJET ?
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
