interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
}

export default function HeadSEO({
  title,
  description,
  canonicalUrl,
  keywords = [],
  ogImage = "/og-image.png",
  ogType = "website",
}: SEOProps) {
  // URL base do site
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  
  // URL canônica (sem parâmetros de consulta)
  const canonicalPath = canonicalUrl || window.location.pathname;
  const fullCanonicalUrl = `${baseUrl}${canonicalPath}`;
  
  // Atualiza o título da página
  document.title = title;
  
  // Atualiza a meta descrição
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  } else {
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = description;
    document.head.appendChild(meta);
  }

  // Atualiza as palavras-chave
  if (keywords.length > 0) {
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywordsString = keywords.join(", ");
    
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywordsString);
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = keywordsString;
      document.head.appendChild(meta);
    }
  }
  
  // Atualiza ou cria link canônico
  const linkCanonical = document.querySelector('link[rel="canonical"]');
  if (linkCanonical) {
    linkCanonical.setAttribute("href", fullCanonicalUrl);
  } else {
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = fullCanonicalUrl;
    document.head.appendChild(link);
  }
  
  // Open Graph (para compartilhamento em redes sociais)
  updateOrCreateMeta("og:title", title);
  updateOrCreateMeta("og:description", description);
  updateOrCreateMeta("og:url", fullCanonicalUrl);
  updateOrCreateMeta("og:type", ogType);
  updateOrCreateMeta("og:image", `${baseUrl}${ogImage}`);
  
  // Twitter Card
  updateOrCreateMeta("twitter:card", "summary_large_image");
  updateOrCreateMeta("twitter:title", title);
  updateOrCreateMeta("twitter:description", description);
  updateOrCreateMeta("twitter:image", `${baseUrl}${ogImage}`);
  
  // Adiciona outras meta tags importantes
  updateOrCreateMeta("robots", "index, follow");
  updateOrCreateMeta("viewport", "width=device-width, initial-scale=1");
  updateOrCreateMeta("author", "Simulador de Financiamento");

  return null; // Este componente não renderiza nada visualmente
}

// Função auxiliar para atualizar ou criar meta tags
function updateOrCreateMeta(name: string, content: string) {
  // Tenta primeiro por property para tags Open Graph
  let meta = document.querySelector(`meta[property="${name}"]`);
  if (!meta) {
    // Depois tenta por name para meta tags regulares
    meta = document.querySelector(`meta[name="${name}"]`);
  }
  
  if (meta) {
    meta.setAttribute("content", content);
  } else {
    // Verifica se é uma tag Open Graph ou Twitter
    const isOg = name.startsWith("og:");
    const isTwitter = name.startsWith("twitter:");
    
    meta = document.createElement("meta");
    if (isOg || isTwitter) {
      meta.setAttribute("property", name);
    } else {
      meta.setAttribute("name", name);
    }
    meta.setAttribute("content", content);
    document.head.appendChild(meta);
  }
}