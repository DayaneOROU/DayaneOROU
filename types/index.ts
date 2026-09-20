
export type ProjectCategories = {
  id: string
  name: string
}


export type Stacks = {
  id: string
  name: string
  icon: string | null   // peut être null si pas d'icône définie
  color: string | null  // peut être null si pas de couleur définie
}
export type Projects = {
  id: string
  category_id: string | null        // null si pas de catégorie assignée
  title: string
  description: string | null
  image_url: string | null          // null si pas d'image uploadée
  project_url: string | null        // null si pas de lien
  status: 'published' | 'draft'     // uniquement ces deux valeurs possibles
  created_at: string
  updated_at: string
  category?: ProjectCategories      // ? = optionnel
  stacks?: Stacks[]                  // liste des stacks du projet
}

export type Blogs = {
  id: string
  project_id: string | null         // null si pas lié à un projet
  title: string
  slug: string
  content: string | null            // HTML généré par TipTap
  cover_url: string | null
  published: boolean
  created_at: string
  updated_at: string
  // Relation optionnelle
  project?: Projects                // le projet associé si demandé
}

export type Messages = {
  id: string
  name: string
  email: string
  category: 'Collaboration' | 'Freelance' | 'Question' | 'Autre'
  subject: string
  body: string
  read: boolean
  created_at: string
}

export type CreateProjectInput = Omit<Projects, 'id' | 'created_at' | 'updated_at' | 'category' | 'stacks'>

// Ce qu'on envoie pour MODIFIER un projet (tous les champs sont optionnels)
export type UpdateProjectInput = Partial<CreateProjectInput>

// Même logique pour Blog
export type CreateBlogInput = Omit<Blogs, 'id' | 'created_at' | 'updated_at' | 'project'>
export type UpdateBlogInput = Partial<CreateBlogInput>