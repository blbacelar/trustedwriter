const translations = {
  landing: {
    title: "Escribe tu aplicación de TrustedHousesitters con IA",
    description:
      "Obtén ayuda para escribir tu aplicación para cuidado de casas. Nuestro asistente de IA te ayuda a crear aplicaciones personalizadas y atractivas.",
    cta: "Empezar a Escribir",
    features: {
      personalized: {
        title: "Aplicaciones Personalizadas",
        description: "Adaptadas a cada oportunidad de cuidado de casa",
      },
      ai: {
        title: "Impulsado por IA",
        description: "IA avanzada ayuda a crear mensajes atractivos",
      },
      fast: {
        title: "Rápido y Fácil",
        description: "Escribe aplicaciones en minutos, no horas",
      },
    },
  },
  promo: {
    title: "Únete a TrustedHousesitters",
    description: "Encuentra oportunidades de cuidado de casas en todo el mundo",
    cta: "Regístrate Ahora",
  },
  footer: {
    brand: {
      description: "Escritor de aplicaciones con IA para TrustedHousesitters",
    },
    quickLinks: {
      title: "Enlaces Rápidos",
      settings: "Configuración",
      home: "Inicio",
      faq: "Preguntas Frecuentes",
    },
    resources: {
      title: "Recursos",
      join: "Únete a TrustedHousesitters",
    },
    copyright: {
      text: "© {year} TrustedWriter. Todos los derechos reservados.",
      referral:
        "Este sitio contiene enlaces de afiliados a TrustedHousesitters.",
    },
  },
  errors: {
    serviceUnavailable: {
      title: "Servicio Parcialmente Degradado",
      funMessage: {
        line1: "Nuestra IA está tomando un café rápido",
        line2: "¡Volveremos a toda potencia en breve!",
      },
    },
    notFound: {
      title: "Página No Encontrada",
      description: "La página que buscas no existe o ha sido movida.",
    },
  },
  faq: {
    title: "Preguntas Frecuentes",
    subtitle: "Encuentra respuestas a preguntas comunes sobre TrustedWriter",
    searchPlaceholder: "Buscar FAQ...",
    noResults:
      "No se encontraron resultados. Intenta ajustar tu búsqueda o filtro de categoría.",
    categories: {
      all: "Todas las Categorías",
      gettingStarted: "Comenzar",
      billing: "Facturación",
      settings: "Configuración",
      security: "Seguridad",
    },
    support: {
      title: "¿Todavía tienes preguntas?",
      subtitle:
        "¿No encuentras lo que buscas? Nuestro equipo de soporte está aquí para ayudarte.",
      button: "Contactar Soporte",
    },
  },
  credits: {
    unit: "créditos",
  },
  dashboard: {
    title: "Genera tu Aplicación Perfecta de House Sitting",
    subtitle:
      "Simplemente pega la URL del anuncio de TrustedHousesitters y deja que la IA cree una aplicación personalizada basada en tu perfil.",
    generatedTitle: "Tu Aplicación Generada",
    copied: {
      title: "¡Copiado!",
      description: "Aplicación copiada al portapapeles",
    },
    urlInput: {
      label: "URL del Anuncio",
      placeholder: "Pega aquí la URL del anuncio de TrustedHousesitters",
      button: "Generar Aplicación",
    },
    error: {
      invalidUrl: "Por favor, ingresa una URL válida de TrustedHousesitters",
      generic: "Algo salió mal. Por favor, inténtalo de nuevo.",
    },
    searchbar: {
      placeholder: "Pega aquí la URL del anuncio de TrustedHousesitters",
      button: "Generar",
      noProfile: "Por favor, completa tu perfil primero",
      failed: "Error al verificar el perfil",
    },
    table: {
      title: "Tus Aplicaciones",
      search: "Buscar aplicaciones...",
      date: "Fecha",
      content: "Contenido",
      listing: "Anuncio",
      actions: "Acciones",
    },
  },
  search: {
    input: {
      label: "Buscar",
      placeholder: "Ingresa la URL del anuncio...",
      button: "Buscar",
      loading: "Buscando...",
    },
    error: {
      invalid: "Por favor, ingresa una URL válida",
      notFound: "No se encontró ningún anuncio en esta URL",
    },
  },
  applications: {
    table: {
      date: "Fecha",
      actions: "Acciones",
      noApplications: "Aún no hay aplicaciones",
      copy: "Copiar",
      copied: "¡Copiado!",
      view: "Ver",
      edit: "Editar",
      delete: "Eliminar",
    },
  },
  nav: {
    settings: "Configuración",
    signOut: "Cerrar Sesión",
    login: "Iniciar Sesión",
    signup: "Registrarse",
  },
  settings: {
    title: "Configuración",
    profile: {
      title: "Tu Perfil",
      helper: "Este perfil se utilizará para generar tus aplicaciones",
    },
    rules: {
      title: "Reglas de Aplicación",
      placeholder: "Agregar una regla para generar aplicaciones...",
      add: "Agregar Regla",
      deleteButton: "Eliminar Regla",
    },
    save: {
      button: "Guardar Cambios",
      saving: "Guardando...",
      success: "Cambios guardados correctamente",
      error: "Error al guardar los cambios",
    },
  },
} as const;

export default translations;
