sequenceDiagram
    participant FE as Frontend
    participant Route as Express Router
    participant AuthMW as Auth Middleware
    participant GalleryCtrl as Gallery Controller
    participant EventModel as Event Model
    participant UploadMW as Upload Middleware
    participant CloudinaryStorage as Cloudinary Storage
    participant CF as Cloudinary API
    participant GalleryModel as Gallery Model
    participant DB as Database

    Note over FE,DB: Proceso completo de subida de imágenes con arquitectura interna

    %% Request inicial
    FE->>Route: POST /events/{eventId}/gallery/upload
    Note right of FE: Headers: Authorization: Bearer {token}<br/>Body: FormData con imágenes

    %% Middleware de autenticación
    Route->>AuthMW: Verificar autenticación
    AuthMW->>AuthMW: Validar JWT token
    alt Token inválido
        AuthMW-->>FE: 401 - Unauthorized
    end
    AuthMW->>Route: Usuario autenticado ✓

    %% Llegada al controlador
    Route->>GalleryCtrl: uploadImages(req, res, next)
    
    %% Obtener información del evento
    GalleryCtrl->>EventModel: getById(eventId)
    EventModel->>DB: SELECT * FROM events WHERE id = ?
    DB-->>EventModel: Event data
    EventModel-->>GalleryCtrl: Event object
    
    alt Evento no encontrado
        GalleryCtrl-->>FE: 404 - Event not found
    end

    %% Configuración dinámica del middleware de upload
    Note over GalleryCtrl: Configurar carpeta: "events/{eventName}"
    GalleryCtrl->>UploadMW: uploadGallery("events/" + event.eventName)
    
    %% Configuración de Cloudinary Storage
    UploadMW->>CloudinaryStorage: new CloudinaryStorage()
    Note over CloudinaryStorage: Configurar parámetros:<br/>- folder: events/{eventName}<br/>- format: extensión original<br/>- public_id: fieldname-timestamp

    %% Ejecutar middleware de multer
    GalleryCtrl->>UploadMW: .array('images', 100)(req, res, callback)
    
    %% Procesamiento de cada archivo
    loop Para cada archivo en req.files
        UploadMW->>CloudinaryStorage: Procesar archivo
        CloudinaryStorage->>CF: Upload imagen
        Note right of CloudinaryStorage: Parámetros:<br/>- Folder específico<br/>- Public ID único<br/>- Formato original
        CF-->>CloudinaryStorage: URL + metadata
        CloudinaryStorage-->>UploadMW: Archivo procesado
    end
    
    %% Callback del middleware
    UploadMW->>GalleryCtrl: callback(error, files)
    
    alt Error en upload
        GalleryCtrl-->>FE: 500 - Upload error
    end

    %% Guardar referencias en base de datos
    loop Para cada archivo subido
        Note over GalleryCtrl: Extraer: url, publicId, originalName
        GalleryCtrl->>GalleryModel: create(galleryData)
        GalleryModel->>DB: INSERT INTO gallery VALUES(...)
        DB-->>GalleryModel: Inserted record
        GalleryModel-->>GalleryCtrl: Gallery object
    end

    %% Respuesta exitosa
    GalleryCtrl-->>Route: Success response
    Route-->>FE: 201 - Images uploaded successfully
    Note left of Route: {<br/>  "success": true,<br/>  "message": "X images uploaded",<br/>  "data": [gallery records]<br/>}

    %% Manejo de errores específicos
    alt Error de validación de archivo
        UploadMW-->>GalleryCtrl: ValidationError
        GalleryCtrl-->>FE: 400 - Invalid file
    end
    
    alt Error de límite de tamaño
        UploadMW-->>GalleryCtrl: FileTooLargeError
        GalleryCtrl-->>FE: 413 - File too large
    end
    
    alt Error de base de datos
        GalleryModel-->>GalleryCtrl: DatabaseError
        GalleryCtrl-->>FE: 500 - Database error
    end