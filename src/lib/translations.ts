export const translations = {
  en: {
    hero: {
      title: "Get Your Dream House Sitting Gig",
      subtitle:
        "AI-powered applications that help you stand out and get accepted faster",
      cta: "Start Writing for Free",
    },
    features: {
      ai: {
        title: "AI-Powered Writing",
        description: "Personalized applications using advanced AI technology",
      },
      time: {
        title: "Time Saving",
        description: "Generate applications in seconds, not hours",
      },
      success: {
        title: "Higher Success Rate",
        description: "Stand out with tailored, professional applications",
      },
    },
    pricing: {
      title: "Single Payment, Lifetime Access",
      free: {
        title: "Free",
        features: ["3 applications per month"],
        cta: "Get Started",
      },
      pro: {
        title: "Pro",
        features: ["Unlimited applications", "Priority support"],
        cta: "Get Pro",
        popular: "Popular",
        loading: "Processing...",
      },
      periods: {
        monthly: "Monthly",
        annual: "Annual",
        lifetime: "Lifetime",
      },
      saveUpTo: "Save up to",
      perMonth: "/mo",
      perYear: "/yr",
      subscriptions: "Subscriptions",
      credits: {
        title: "Credit Packages",
        unit: "credits",
        perCredit: "per credit",
        buy: "Buy Credits",
      },
      loading: "Processing...",
    },
    cta: {
      title: "Ready to Start Your House Sitting Journey?",
      button: "Create Your Account",
    },
    promo: {
      title: "Special Offer: Get 25% Off TrustedHousesitters",
      description:
        "Join the global community of pet lovers and get 25% off your membership",
      cta: "Claim Your 25% Discount",
    },
    footer: {
      brand: {
        description:
          "Streamline your house-sitting applications with AI-powered personalization.",
      },
      quickLinks: {
        title: "Quick Links",
        settings: "Settings",
        home: "Home",
      },
      resources: {
        title: "Resources",
        join: "Join TrustedHousesitters",
        github: "GitHub Repository",
      },
      copyright: {
        text: "© {year} TrustedWriter. Not affiliated with TrustedHousesitters.",
        referral:
          "Get 25% off your TrustedHousesitters membership using our referral link",
      },
    },
    dashboard: {
      title: "Generate Your Perfect House Sitting Application",
      subtitle:
        "Simply paste the TrustedHousesitters listing URL and let AI create a personalized application based on your profile.",
      generatedTitle: "Your Generated Application",
      copied: {
        title: "Copied!",
        description: "Application copied to clipboard",
      },
      editor: {
        edit: "Edit",
        save: "Save",
        copy: "Copy to Clipboard",
        editingHint: "Click outside or press Save when you're done editing",
        loading: {
          title: "Generating your application...",
        },
      },
      searchbar: {
        placeholder: "Paste TrustedHousesitters listing URL here...",
        button: "Generate Application",
        error: "Please provide a valid TrustedHousesitters listing URL",
        failed: "Failed to generate application. Please try again.",
        noProfile: "Please complete your profile settings first",
        profileRequired:
          "You need to set up your profile before generating applications.",
        setupProfile: "Set up profile",
      },
      table: {
        title: "Applications",
        date: "Date",
        content: "Content",
        listing: "Job Listing",
        actions: "Actions",
        copy: "Copy content",
        view: "View listing",
        search: "Search applications...",
        noResults: "No results found",
        noApplications: "No applications yet",
        edit: "Edit application",
        editTitle: "Edit Application",
        editSuccess: "Application updated successfully",
        editError: "Failed to update application",
      },
    },
    settings: {
      title: "Settings",
      profile: {
        title: "Your Profile",
        placeholder: "Paste your trustedhousesitters profile here...",
        helper:
          "Describe yourself, your experience with pets, and why you love house sitting. This will be used to personalize your applications. You can copy your profile from TrustedHousesitters and paste it here.",
      },
      rules: {
        title: "Application Rules",
        tooltip: "Rules to follow when generating applications",
        placeholder: "Add a new rule and press Enter",
        add: "Add Rule",
        deleteButton: "Delete rule",
      },
      save: {
        button: "Save Settings",
        saving: "Saving...",
        success: "Settings saved successfully!",
        error: "Failed to save settings",
      },
      subscription: {
        title: "Subscription Management",
        status: "Subscription Status",
        active: "Active",
        inactive: "Inactive",
        canceled: "Canceled",
        cancelButton: "Cancel Subscription",
        canceling: "Canceling...",
        cancelSuccess: "Subscription canceled successfully",
        cancelError: "Failed to cancel subscription",
        endsAt: "Subscription ends at",
        cancelDialog: {
          title: "Cancel Subscription",
          description:
            "Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.",
          cancel: "Keep Subscription",
          confirm: "Yes, Cancel",
        },
        reactivate: "Reactivate Subscription",
        reactivating: "Reactivating...",
        reactivateSuccess: "Subscription reactivated successfully",
        reactivateError: "Failed to reactivate subscription",
        free: "Free Plan",
        upgradeCTA: "Upgrade to Pro",
      },
    },
    navbar: {
      settings: "Settings",
      login: "Login",
      signup: "Sign Up",
      signOut: "Sign Out",
      language: "Language",
    },
    billing: {
      success: {
        title: "Thank you for subscribing!",
        description:
          "Your subscription has been confirmed. You will be redirected to the settings page shortly.",
      },
      canceled: {
        title: "Checkout process canceled",
        description:
          "The checkout process was canceled. You will be redirected to the settings page shortly.",
      },
    },
    credits: {
      remaining: "{{count}} applications left",
      unit: "credits",
      buyMore: "Buy more credits",
      buyTitle: "Get More Credits",
    },
    nav: {
      settings: "Settings",
      signOut: "Sign Out",
      login: "Login",
      signup: "Sign Up",
      language: "Language",
    },
    tutorial: {
      welcome: {
        title: "Welcome to TrustedWriter!",
        description:
          "Let's get you started with generating personalized house sitting applications in just a few steps.",
      },
      settings: {
        title: "Customize Your Applications",
        description:
          "In Settings, you'll set up two important things: your profile and application rules. Your profile tells us about your experience, while rules help fine-tune how AI writes your applications. For example, you can add rules like 'Always mention my experience with dogs' or 'Emphasize my flexibility with dates'. These rules ensure each application reflects exactly what you want to highlight.",
      },
      ready: {
        title: "You're Almost Ready!",
        description:
          "We'll take you to the Settings page now. Remember: better rules mean better applications. Take a moment to think about what makes you unique as a house sitter!",
      },
      button: {
        next: "Next",
        finish: "Let's Go!",
      },
    },
    errors: {
      serviceUnavailable: {
        title: "Service Unavailable",
        defaultMessage:
          "The service is currently unavailable. Please try again later.",
        funMessage: {
          line1: "Our pets are currently chasing the server hamsters...",
          line2: "We'll have everything back up and running shortly! 🐹",
        },
      },
    },
  },
  pt: {
    hero: {
      title: "Conquiste sua Vaga dos Sonhos como House Sitter",
      subtitle:
        "Aplicações potencializadas por IA que ajudam você a se destacar e ser aceito mais rápido",
      cta: "Comece a Escrever Gratuitamente",
    },
    features: {
      ai: {
        title: "Escrita com IA",
        description:
          "Aplicações personalizadas usando tecnologia avançada de IA",
      },
      time: {
        title: "Economia de Tempo",
        description: "Gere aplicações em segundos, não em horas",
      },
      success: {
        title: "Maior Taxa de Sucesso",
        description: "Destaque-se com aplicações profissionais personalizadas",
      },
    },
    pricing: {
      title: "Pagamento Único, Acesso Vitalício",
      free: {
        title: "Grátis",
        features: ["3 aplicações por mês"],
        cta: "Começar",
      },
      pro: {
        title: "Pro",
        features: ["Aplicações ilimitadas", "Suporte prioritário"],
        cta: "Obter Pro",
        popular: "Popular",
        loading: "Processando...",
      },
      periods: {
        monthly: "Mensal",
        annual: "Anual",
        lifetime: "Vida",
      },
      saveUpTo: "Economize até",
      perMonth: "/mês",
      perYear: "/ano",
      subscriptions: "Assinaturas",
      credits: {
        title: "Pacotes de Créditos",
        unit: "créditos",
        perCredit: "por crédito",
        buy: "Comprar Créditos",
      },
      loading: "Processando...",
    },
    cta: {
      title: "Pronto para Começar sua Jornada como House Sitter?",
      button: "Criar sua Conta",
    },
    promo: {
      title: "Oferta Especial: 25% de Desconto no TrustedHousesitters",
      description:
        "Junte-se à comunidade global de amantes de animais e ganhe 25% de desconto na sua assinatura",
      cta: "Resgatar seu Desconto de 25%",
    },
    footer: {
      brand: {
        description:
          "Otimize suas aplicações de house-sitting com personalização alimentada por IA.",
      },
      quickLinks: {
        title: "Links Rápidos",
        settings: "Configurações",
        home: "Início",
      },
      resources: {
        title: "Recursos",
        join: "Junte-se ao TrustedHousesitters",
        github: "Repositório GitHub",
      },
      copyright: {
        text: "© {year} TrustedWriter. Não afiliado ao TrustedHousesitters.",
        referral:
          "Ganhe 25% de desconto na sua assinatura do TrustedHousesitters usando nosso link de indicação",
      },
    },
    dashboard: {
      title: "Gere sua Aplicação Perfeita de House Sitting",
      subtitle:
        "Simplesmente cole a URL do anúncio do TrustedHousesitters e deixe a IA criar uma aplicação personalizada baseada no seu perfil.",
      generatedTitle: "Sua Aplicação Gerada",
      copied: {
        title: "Copiado!",
        description: "Aplicação copiada para a área de transferência",
      },
      editor: {
        edit: "Editar",
        save: "Salvar",
        copy: "Copiar para Área de Transferência",
        editingHint:
          "Clique fora ou pressione Salvar quando terminar de editar",
        loading: {
          title: "Gerando sua aplicação...",
        },
      },
      searchbar: {
        placeholder: "Cole a URL do anúncio do TrustedHousesitters aquí...",
        button: "Gerar Aplicação",
        error: "Por favor, forneça uma URL válida do TrustedHousesitters",
        failed: "Falha ao gerar aplicação. Por favor, tente novamente.",
        noProfile:
          "Por favor, complete as configurações do seu perfil primeiro",
        profileRequired:
          "Você precisa configurar seu perfil antes de gerar aplicações.",
        setupProfile: "Configurar perfil",
      },
      table: {
        title: "Candidaturas",
        date: "Date",
        content: "Content",
        listing: "Listing",
        actions: "Actions",
        copy: "Copy content",
        view: "View listing",
        search: "Search applications...",
        noResults: "No applications found",
        noApplications: "No applications yet",
        edit: "Edit application",
        editTitle: "Edit Application",
        editSuccess: "Application updated successfully",
        editError: "Failed to update application",
      },
    },
    settings: {
      title: "Configurações",
      profile: {
        title: "Seu Perfil",
        placeholder:
          "Cole a descrição do seu perfil de TrustedHousesitters aquí...",
        helper:
          "Descreva você, sua experiência com animais e por que você ama house sitting. Isso será usado para personalizar suas aplicações. Você pode copiar seu perfil do TrustedHousesitters e colar aqui.",
      },
      rules: {
        title: "Regras de Aplicação",
        tooltip: "Regras a seguir ao gerar aplicações",
        placeholder: "Adicione uma nova regra e pressione Enter",
        add: "Adicionar Regra",
        deleteButton: "Excluir regra",
      },
      save: {
        button: "Salvar Configurações",
        saving: "Salvando...",
        success: "Configurações salvas com sucesso!",
        error: "Falha ao salvar configurações",
      },
      subscription: {
        title: "Gerenciamento de Assinatura",
        status: "Status da Assinatura",
        active: "Ativo",
        inactive: "Inativo",
        canceled: "Cancelado",
        cancelButton: "Cancelar Assinatura",
        canceling: "Cancelando...",
        cancelSuccess: "Assinatura cancelada com sucesso",
        cancelError: "Falha ao cancelar assinatura",
        endsAt: "Assinatura termina em",
        cancelDialog: {
          title: "Cancelar Assinatura",
          description:
            "Tem certeza de que deseja cancelar sua assinatura? Você continuará tendo acesso até o final do seu período de cobrança.",
          cancel: "Manter Assinatura",
          confirm: "Sim, Cancelar",
        },
        reactivate: "Reativar Assinatura",
        reactivating: "Reativando...",
        reactivateSuccess: "Assinatura reativada com sucesso",
        reactivateError: "Falha ao reativar assinatura",
        free: "Plano Grátis",
        upgradeCTA: "Atualizar para Pro",
      },
    },
    navbar: {
      settings: "Configurações",
      login: "Login",
      signup: "Sign Up",
      signOut: "Sign Out",
      language: "Language",
    },
    billing: {
      success: {
        title: "Obrigado por se inscrever!",
        description:
          "Sua inscrição foi confirmada. Você será redirecionado para a página de configurações em breve.",
      },
      canceled: {
        title: "Processo de checkout cancelado",
        description:
          "O processo de checkout foi cancelado. Você será redirecionado para a página de configurações em breve.",
      },
    },
    credits: {
      remaining: "{{count}} aplicações restantes",
      unit: "créditos",
      buyMore: "Buy more credits",
      buyTitle: "Get More Credits",
    },
    nav: {
      settings: "Configurações",
      signOut: "Sair",
      login: "Entrar",
      signup: "Cadastrar",
      language: "Language",
    },
    tutorial: {
      welcome: {
        title: "Bem-vindo ao TrustedWriter!",
        description:
          "Vamos começar a gerar aplicações personalizadas para house sitting em apenas alguns passos.",
      },
      settings: {
        title: "Personalize Suas Aplicações",
        description:
          "Nas Configurações, você definirá duas coisas importantes: seu perfil e regras de aplicação. Seu perfil nos conta sobre sua experiência, enquanto as regras ajudam a ajustar como a IA escreve suas aplicações. Por exemplo, você pode adicionar regras como 'Sempre mencionar minha experiência com cães' ou 'Enfatizar minha flexibilidade com datas'. Essas regras garantem que cada aplicação reflita exatamente o que você quer destacar.",
      },
      ready: {
        title: "Você está Quase Pronto!",
        description:
          "Vamos te levar para a página de Configurações agora. Lembre-se: melhores regras significam melhores aplicações. Dedique um momento para pensar no que torna você único como house sitter!",
      },
      button: {
        next: "Próximo",
        finish: "Vamos lá!",
      },
    },
    errors: {
      serviceUnavailable: {
        title: "Serviço Indisponível",
        defaultMessage:
          "O serviço está temporariamente indisponível. Por favor, tente novamente mais tarde.",
        funMessage: {
          line1: "Nossos pets estão perseguindo os hamsters do servidor...",
          line2: "Em breve tudo estará funcionando novamente! 🐹",
        },
      },
    },
  },
  es: {
    hero: {
      title: "Consigue tu Trabajo Soñado de House Sitting",
      subtitle:
        "Aplicaciones potenciadas por IA que te ayudan a destacar y ser aceptado más rápido",
      cta: "Empieza a Escribir Gratis",
    },
    features: {
      ai: {
        title: "Escritura con IA",
        description:
          "Aplicaciones personalizadas usando tecnología avanzada de IA",
      },
      time: {
        title: "Ahorro de Tiempo",
        description: "Genera aplicaciones en segundos, no en horas",
      },
      success: {
        title: "Mayor Tasa de Éxito",
        description: "Destaca con aplicaciones profesionales personalizadas",
      },
    },
    pricing: {
      title: "Pago Único, Acceso de por Vida",
      free: {
        title: "Gratis",
        features: ["3 aplicaciones por mes"],
        cta: "Comenzar",
      },
      pro: {
        title: "Pro",
        features: ["Aplicaciones ilimitadas", "Soporte prioritario"],
        cta: "Obtener Pro",
        popular: "Popular",
        loading: "Procesando...",
      },
      periods: {
        monthly: "Mensual",
        annual: "Anual",
        lifetime: "Vida",
      },
      saveUpTo: "Economize hasta",
      perMonth: "/mes",
      perYear: "/año",
      subscriptions: "Suscripciones",
      credits: {
        title: "Paquetes de Créditos",
        unit: "créditos",
        perCredit: "por crédito",
        buy: "Comprar Créditos",
      },
      loading: "Procesando...",
    },
    cta: {
      title: "¿Listo para Comenzar tu Viaje como House Sitter?",
      button: "Crear tu Cuenta",
    },
    promo: {
      title: "Oferta Especial: 25% de Descuento en TrustedHousesitters",
      description:
        "Únete a la comunidad global de amantes de mascotas y obtén un 25% de descuento en tu membresía",
      cta: "Reclama tu 25% de Descuento",
    },
    footer: {
      brand: {
        description:
          "Optimiza tus aplicaciones de house-sitting con personalización impulsada por IA.",
      },
      quickLinks: {
        title: "Enlaces Rápidos",
        settings: "Configuración",
        home: "Inicio",
      },
      resources: {
        title: "Recursos",
        join: "Únete a TrustedHousesitters",
        github: "Repositorio GitHub",
      },
      copyright: {
        text: "© {year} TrustedWriter. No afiliado con TrustedHousesitters.",
        referral:
          "Obtén 25% de descuento en tu membresía de TrustedHousesitters usando nuestro enlace de referido",
      },
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
      editor: {
        edit: "Editar",
        save: "Guardar",
        copy: "Copiar al Portapapeles",
        editingHint:
          "Haz clic fuera o presiona Guardar cuando termines de editar",
        loading: {
          title: "Generando tu aplicación...",
        },
      },
      searchbar: {
        placeholder: "Pega la URL del anuncio de TrustedHousesitters aquí...",
        button: "Generar Aplicación",
        error: "Por favor, proporciona una URL válida de TrustedHousesitters",
        failed:
          "Error al generar la aplicación. Por favor, inténtalo de nuevo.",
        noProfile: "Por favor, complete las configuraciones del perfil primero",
        profileRequired:
          "Necesitas configurar tu perfil antes de generar aplicaciones.",
        setupProfile: "Configurar perfil",
      },
      table: {
        title: "Aplicaciones",
        date: "Fecha",
        content: "Contenido",
        listing: "Anuncio",
        actions: "Acciones",
        copy: "Copiar contenido",
        view: "Ver anuncio",
        search: "Buscar aplicaciones...",
        noResults: "No se encontraron resultados",
        noApplications: "Aún no hay aplicaciones",
        edit: "Edit application",
        editTitle: "Edit Application",
        editSuccess: "Application updated successfully",
        editError: "Failed to update application",
      },
    },
    settings: {
      title: "Configuración",
      profile: {
        title: "Tu Perfil",
        placeholder:
          "Cole la descripción de tu perfil de TrustedHousesitters aquí...",
        helper:
          "Describe quién eres, tu experiencia con mascotas y por qué te gusta el house sitting. Esto se usará para personalizar tus aplicaciones. Puedes copiar tu perfil de TrustedHousesitters y pegarlo aquí.",
      },
      rules: {
        title: "Reglas de Aplicación",
        tooltip: "Reglas a seguir al generar aplicaciones",
        placeholder: "Agregar una nueva regla...",
        add: "Agregar Regla",
        deleteButton: "Eliminar regla",
      },
      save: {
        button: "Guardar Configuración",
        saving: "Guardando...",
        success: "¡Configuración guardada exitosamente!",
        error: "Error al guardar la configuración",
      },
      subscription: {
        title: "Gerenciamento de Suscripción",
        status: "Estado de la Suscripción",
        active: "Activo",
        inactive: "Inactivo",
        canceled: "Cancelado",
        cancelButton: "Cancelar Suscripción",
        canceling: "Cancelando...",
        cancelSuccess: "Suscripción cancelada con éxito",
        cancelError: "Error al cancelar la suscripción",
        endsAt: "Suscripción termina en",
        cancelDialog: {
          title: "Cancelar Suscripción",
          description:
            "¿Estás seguro de que quieres cancelar tu suscripción? Continuarás teniendo acceso hasta el final de tu período de facturación.",
          cancel: "Mantener Suscripción",
          confirm: "Sí, Cancelar",
        },
        reactivate: "Reactivar Suscripción",
        reactivating: "Reactivando...",
        reactivateSuccess: "Suscripción reactivada con éxito",
        reactivateError: "Error al reactivar la suscripción",
        free: "Plano Grátis",
        upgradeCTA: "Actualizar a Pro",
      },
    },
    navbar: {
      settings: "Configuración",
      login: "Login",
      signup: "Sign Up",
      signOut: "Sign Out",
      language: "Language",
    },
    billing: {
      success: {
        title: "¡Gracias por suscribirte!",
        description:
          "Tu suscripción ha sido confirmada. Serás redirigido a la página de configuración en breve.",
      },
      canceled: {
        title: "Proceso de pago cancelado",
        description:
          "El proceso de pago ha sido cancelado. Serás redirigido a la página de configuración en breve.",
      },
    },
    credits: {
      remaining: "{{count}} aplicaciones restantes",
      unit: "créditos",
      buyMore: "Buy more credits",
      buyTitle: "Get More Credits",
    },
    nav: {
      settings: "Configuración",
      signOut: "Cerrar Sesión",
      login: "Iniciar Sesión",
      signup: "Registrarse",
      language: "Language",
    },
    tutorial: {
      welcome: {
        title: "¡Bienvenido a TrustedWriter!",
        description:
          "Comencemos a generar aplicaciones personalizadas para house sitting en solo unos pasos.",
      },
      settings: {
        title: "Personaliza tus Aplicaciones",
        description:
          "En Configuración, establecerás dos cosas importantes: tu perfil y reglas de aplicación. Tu perfil nos cuenta sobre tu experiencia, mientras que las reglas ayudan a ajustar cómo la IA escribe tus aplicaciones. Por ejemplo, puedes agregar reglas como 'Siempre mencionar mi experiencia con perros' o 'Enfatizar mi flexibilidad con fechas'. Estas reglas aseguran que cada aplicación refleje exactamente lo que quieres destacar.",
      },
      ready: {
        title: "¡Estás Casi Listo!",
        description:
          "Te llevaremos a la página de Configuración ahora. Recuerda: mejores reglas significan mejores aplicaciones. ¡Tómate un momento para pensar en lo que te hace único como house sitter!",
      },
      button: {
        next: "Siguiente",
        finish: "¡Vamos!",
      },
    },
    errors: {
      serviceUnavailable: {
        title: "Servicio No Disponible",
        defaultMessage:
          "El servicio no está disponible en este momento. Por favor, inténtelo de nuevo más tarde.",
        funMessage: {
          line1:
            "Nuestras mascotas están persiguiendo a los hámsters del servidor...",
          line2: "¡Pronto tendremos todo funcionando de nuevo! 🐹",
        },
      },
    },
  },
};

export type Language = keyof typeof translations;
