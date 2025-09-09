sequenceDiagram
    participant Admin as Administrador
    participant User as Usuario Final
    participant API as Bohemia API
    participant Auth as Sistema Auth
    participant Business as Lógica de Negocio
    participant DB as Base de Datos

    Note over Admin, DB: FASE 1: CREACIÓN DEL EVENTO
    
    Admin->>API: POST /events (datos + imagen)
    API->>Auth: Verificar token admin
    Auth-->>API: ✓ Usuario autorizado
    API->>Business: Validar datos del evento
    Business->>DB: Crear evento con imagen
    DB-->>Business: Evento creado (ID: 123)
    Business-->>API: Evento guardado
    API-->>Admin: 201 - Evento creado exitosamente

    Note over Admin, DB: FASE 2: CREACIÓN DE TIPOS DE TICKETS
    
    loop Para cada tipo de ticket (Ej: Early Bird, VIP, General)
        Admin->>API: POST /ticket-types (nombre, precio, cantidad, fechas)
        API->>Auth: Verificar token admin
        Auth-->>API: ✓ Usuario autorizado
        API->>Business: Validar datos y capacidad del venue
        Business->>DB: Verificar capacidad total vs ubicación
        DB-->>Business: Capacidad disponible
        Business->>DB: Crear tipo de ticket
        DB-->>Business: TicketType creado (availableTickets = maxQuantity)
        Business-->>API: Tipo de ticket guardado
        API-->>Admin: 201 - Tipo de ticket creado
    end

    Note over Admin, DB: FASE 3: PUBLICACIÓN Y DISPONIBILIDAD
    
    Note over API: El evento y sus ticket types<br/>están ahora disponibles públicamente

    Note over Admin, DB: FASE 4: COMPRA POR USUARIO FINAL
    
    User->>API: GET /events (buscar eventos disponibles)
    API->>DB: Obtener eventos futuros
    DB-->>API: Lista de eventos con ticket types
    API-->>User: Eventos disponibles

    User->>API: GET /events/123 (ver detalles del evento)
    API->>DB: Obtener evento con tipos de tickets
    DB-->>API: Evento completo con disponibilidad
    API-->>User: Detalles del evento y precios

    User->>API: POST /purchases (ticketTypeId, quantity, userId)
    API->>Business: Procesar compra
    
    Business->>DB: Verificar disponibilidad de tickets
    DB-->>Business: availableTickets suficientes
    
    Business->>DB: Reducir availableTickets
    Business->>DB: Crear Purchase (status: Approved)
    Business->>DB: Generar tickets individuales con QR
    
    loop Para cada ticket comprado
        Business->>DB: Crear Ticket (QR único, números)
    end
    
    DB-->>Business: Compra y tickets creados
    Business-->>API: Compra completada
    API-->>User: 201 - Compra exitosa (ticketNumbers, totalPrice)

    Note over Admin, DB: FASE 5: GENERACIÓN DE TICKETS PDF
    
    User->>API: GET /purchases/:purchaseId/ticket/:ticketId
    API->>Business: Generar PDF del ticket
    Business->>DB: Obtener datos completos del ticket
    DB-->>Business: Ticket + Evento + Ubicación + Compra
    Business->>Business: Generar PDF con QR code
    Business-->>API: PDF generado
    API-->>User: Descarga del ticket PDF

    Note over Admin, DB: RESUMEN DEL FLUJO:
    Note over Admin, DB: 1. Admin crea evento con imagen
    Note over Admin, DB: 2. Admin crea tipos de tickets con validación de capacidad
    Note over Admin, DB: 3. Usuario busca y selecciona evento
    Note over Admin, DB: 4. Usuario compra tickets (reduce disponibilidad)
    Note over Admin, DB: 5. Sistema genera tickets PDF con QR únicos
