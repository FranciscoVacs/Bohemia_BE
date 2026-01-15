# Diagrama de Secuencia - Upload de Imágenes de Eventos a Cloudinary

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant Route as Event Images Route
    participant EventImageCtrl as EventImage Controller
    participant EventModel as Event Model
    participant UploadMW as Upload Middleware
    participant Cloudinary as Cloudinary
    participant EventImageModel as EventImage Model
    participant DB as Database

    Note over FE, DB: Subida de múltiples imágenes a Cloudinary

    FE->>Route: POST /event-images/upload/{eventId}
    Note over FE: Con archivos en FormData: images[]

    Route->>Route: verifyToken (JWT)
    Route->>Route: isAdmin (verificar permisos)
    Route->>Route: schemaValidator (validar eventId)

    alt Token inválido o no admin
        Route-->>FE: 401/403 - Unauthorized/Forbidden
    end

    Route->>EventImageCtrl: uploadImages(req, res, next)

    EventImageCtrl->>EventModel: getById(eventId)

    EventModel-->>EventImageCtrl: Event object

    alt Evento no existe
        EventImageCtrl-->>FE: 404 - Event not found
    end

    Note over EventImageCtrl: Configurar carpeta: "events/{eventName}"
    EventImageCtrl->>UploadMW: uploadEventImage("events/" + event.eventName)
    
    Note over UploadMW: Configurar CloudinaryStorage con:
    Note over UploadMW: - folder: events/{eventName}
    Note over UploadMW: - format: extensión del archivo
    Note over UploadMW: - publicId: fieldname-timestamp

    EventImageCtrl->>UploadMW: .array('images', 10)(req, res, callback)

    loop Para cada archivo (máx 10)
        UploadMW->>Cloudinary: upload(file)
        Note over Cloudinary: Procesar y almacenar imagen
        Cloudinary-->>UploadMW: {url, publicId, format, ...}
    end

    UploadMW->>EventImageCtrl: callback(error, files)

    alt Error en upload
        EventImageCtrl-->>FE: 400 - Upload error
    end

    loop Para cada archivo subido
        Note over EventImageCtrl: Extraer: url, publicId, originalName
        EventImageCtrl->>EventImageModel: create(imageData)
        EventImageModel->>DB: INSERT INTO event_images VALUES(...)
        DB-->>EventImageModel: EventImage object
        EventImageModel-->>EventImageCtrl: EventImage created
    end

    EventImageCtrl-->>FE: 201 - Images uploaded successfully
    Note over FE: Response: {success: true, message: "N images uploaded", data: [...]}
```

## Flujo de Eliminación de Imágenes

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant Route as Event Images Route
    participant EventImageCtrl as EventImage Controller
    participant EventImageModel as EventImage Model
    participant Cloudinary as Cloudinary
    participant DB as Database

    Note over FE, DB: Eliminación de imágenes (individual o por evento)

    %% Eliminación individual
    FE->>Route: DELETE /event-images/{id}
    Route->>EventImageCtrl: delete(req, res, next)
    EventImageCtrl->>EventImageModel: getById(id)
    EventImageModel-->>EventImageCtrl: EventImage object
    EventImageCtrl->>Cloudinary: destroy(publicId)
    Cloudinary-->>EventImageCtrl: Deletion confirmation
    EventImageCtrl->>EventImageModel: delete(id)
    EventImageModel->>DB: DELETE FROM event_images WHERE id = ?
    DB-->>EventImageModel: Deletion confirmed
    EventImageCtrl-->>FE: 200 - Image deleted successfully

    %% Eliminación por evento
    FE->>Route: DELETE /event-images/event/{eventId}
    Route->>EventImageCtrl: deleteByEventId(req, res, next)
    EventImageCtrl->>EventImageModel: getByEventId(eventId)
    EventImageModel-->>EventImageCtrl: EventImage[]
    
    loop Para cada imagen
        EventImageCtrl->>Cloudinary: destroy(publicId)
        Cloudinary-->>EventImageCtrl: Deletion confirmation
    end
    
    EventImageCtrl->>EventImageModel: deleteByEventId(eventId)
    EventImageModel->>DB: DELETE FROM event_images WHERE event = ?
    DB-->>EventImageModel: Deletion confirmed
    EventImageCtrl-->>FE: 200 - N images deleted successfully
```

## Características de Seguridad

### Autenticación y Autorización
- **JWT Token:** Requerido en header `Authorization: Bearer <token>`
- **Verificación de Admin:** Solo administradores pueden subir/eliminar imágenes
- **Validación de Evento:** Verifica que el evento existe antes de subir imágenes

### Validaciones de Archivos
- **Máximo 10 archivos** por petición
- **Límite de tamaño:** 15MB por archivo
- **Tipos permitidos:** Configurados en CloudinaryStorage
- **Organización:** Carpetas automáticas por evento `events/{eventName}/`

### Manejo de Errores
- **400:** Error en upload o validación de archivos
- **401:** Token faltante o inválido
- **403:** Usuario sin permisos de administrador
- **404:** Evento no encontrado
- **500:** Error interno del servidor