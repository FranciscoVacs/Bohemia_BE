sequenceDiagram
    participant Cliente as Cliente (Admin)
    participant Router as Event Router
    participant AuthMW as Auth Middleware
    participant AdminMW as Admin Middleware
    participant UploadMW as Upload Middleware
    participant ValidatorMW as Schema Validator
    participant Controller as Event Controller
    participant Model as Event Model
    participant BaseModel as Base Model
    participant ORM as MikroORM
    participant DB as Base de Datos

    Note over Cliente: POST /events
    Note over Cliente: Headers: Authorization: Bearer <token>
    Note over Cliente: Body: FormData con datos del evento + archivo imagen

    Cliente->>Router: POST /events (multipart/form-data)
    
    Router->>AuthMW: verifyToken()
    AuthMW->>AuthMW: Extraer token del header Authorization
    AuthMW->>AuthMW: Validar JWT token
    
    alt Token válido
        AuthMW->>AuthMW: Decodificar payload (id, email, isAdmin)
        AuthMW->>Router: req.user = payload
        Router->>AdminMW: isAdmin()
        AdminMW->>AdminMW: Verificar req.user.isAdmin
        
        alt Usuario es admin
            AdminMW->>Router: Continuar
            Router->>UploadMW: uploader (multer middleware)
            UploadMW->>UploadMW: Validar archivo imagen (jpeg/jpg/png)
            UploadMW->>UploadMW: Verificar tamaño < 5MB
            UploadMW->>UploadMW: Guardar archivo en /public/uploads/
            UploadMW->>UploadMW: Generar nombre: timestamp_originalname
            UploadMW->>Router: req.file = archivo guardado
            
            Router->>ValidatorMW: schemaValidator(CreateEventSchema)
            ValidatorMW->>ValidatorMW: Validar formato de fechas (YYYY-MM-DD HH:MM:SS)
            ValidatorMW->>ValidatorMW: Validar que fechas sean futuras
            ValidatorMW->>ValidatorMW: Validar que finish > begin
            ValidatorMW->>ValidatorMW: Validar campos requeridos
            
            alt Validación exitosa
                ValidatorMW->>Router: Datos validados
                Router->>Controller: create(req, res, next)
                
                Controller->>Controller: Extraer datos del req.body
                Note over Controller: eventName, beginDatetime, finishDatetime,<br/>eventDescription, minAge, location, dj
                Controller->>Controller: Obtener filename de req.file
                Controller->>Controller: Construir URL de imagen
                Note over Controller: coverPhoto = basePath + filename
                
                Controller->>Model: create(eventData)
                Model->>BaseModel: create(eventData)
                BaseModel->>ORM: em.create(Event, data)
                ORM->>ORM: Crear instancia de Event
                BaseModel->>ORM: em.flush()
                ORM->>DB: INSERT INTO events (...)
                DB-->>ORM: Evento creado con ID
                ORM-->>BaseModel: Entidad persistida
                BaseModel-->>Model: Event entity
                Model-->>Controller: Event creado
                
                Controller->>Cliente: 201 Created
                Note over Cliente: { message: "Evento creado exitosamente",<br/>data: event }
                
            else Validación fallida
                ValidatorMW->>Cliente: 400 Bad Request
                Note over Cliente: Error de validación
            end
            
        else Usuario no es admin
            AdminMW->>Cliente: 403 Forbidden
            Note over Cliente: "Access denied: Admin only"
        end
        
    else Token inválido
        AuthMW->>Cliente: 401 Unauthorized
        Note over Cliente: "Unauthorized" o "Required token"
    end

    Note over Cliente, DB: Errores posibles en cada paso:
    Note over Cliente, DB: - Token missing/invalid (401)
    Note over Cliente, DB: - Usuario no admin (403) 
    Note over Cliente, DB: - Archivo inválido/muy grande (400)
    Note over Cliente, DB: - Datos inválidos según schema (400)
    Note over Cliente, DB: - Error de base de datos (500)
