export function localBusinessSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.cl";
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: "Umbral Corporal",
    url: siteUrl,
    areaServed: ["Providencia", "Santiago", "Las Condes", "Chile"],
    description: "Servicios profesionales de masoterapia, relajación y bienestar corporal.",
    serviceType: [
      "Masaje relajante",
      "Masaje descontracturante",
      "Masaje mixto",
      "Masaje con piedras calientes",
      "Masaje para piernas cansadas",
      "Masaje craneal",
      "Masaje para bruxismo",
      "Masaje para parálisis facial",
      "Masaje linfático",
      "Masaje reductivo"
    ]
  };
}
