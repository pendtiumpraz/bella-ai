use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpResponse, HttpServer, Result};
use live2d_parser::cubism_v1::Moc;
use live2d_parser::cubism_v3::Moc3;
use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Serialize, Deserialize)]
struct ParseRequest {
    file_path: String,
}

#[derive(Serialize)]
struct ParseResponse {
    success: bool,
    data: Option<serde_json::Value>,
    error: Option<String>,
    model_type: String,
}

async fn parse_moc_file(req: web::Json<ParseRequest>) -> Result<HttpResponse> {
    let file_path = &req.file_path;
    
    // Read file
    let file_data = match fs::read(file_path) {
        Ok(data) => data,
        Err(e) => {
            return Ok(HttpResponse::Ok().json(ParseResponse {
                success: false,
                data: None,
                error: Some(format!("Failed to read file: {}", e)),
                model_type: "unknown".to_string(),
            }));
        }
    };
    
    // Try parsing as Cubism 2.0 first
    if file_path.ends_with(".moc") {
        match unsafe { Moc::new(&file_data) } {
            Ok(moc) => {
                match serde_json::to_value(&moc) {
                    Ok(json_data) => {
                        return Ok(HttpResponse::Ok().json(ParseResponse {
                            success: true,
                            data: Some(json_data),
                            error: None,
                            model_type: "cubism_v2".to_string(),
                        }));
                    }
                    Err(e) => {
                        return Ok(HttpResponse::Ok().json(ParseResponse {
                            success: false,
                            data: None,
                            error: Some(format!("Failed to serialize MOC data: {}", e)),
                            model_type: "cubism_v2".to_string(),
                        }));
                    }
                }
            }
            Err(e) => {
                return Ok(HttpResponse::Ok().json(ParseResponse {
                    success: false,
                    data: None,
                    error: Some(format!("Failed to parse MOC file: {}", e)),
                    model_type: "cubism_v2".to_string(),
                }));
            }
        }
    }
    
    // Try parsing as Cubism 3.0
    if file_path.ends_with(".moc3") {
        match unsafe { Moc3::new(&file_data) } {
            Ok(moc) => {
                match serde_json::to_value(&moc) {
                    Ok(json_data) => {
                        return Ok(HttpResponse::Ok().json(ParseResponse {
                            success: true,
                            data: Some(json_data),
                            error: None,
                            model_type: "cubism_v3".to_string(),
                        }));
                    }
                    Err(e) => {
                        return Ok(HttpResponse::Ok().json(ParseResponse {
                            success: false,
                            data: None,
                            error: Some(format!("Failed to serialize MOC3 data: {}", e)),
                            model_type: "cubism_v3".to_string(),
                        }));
                    }
                }
            }
            Err(e) => {
                return Ok(HttpResponse::Ok().json(ParseResponse {
                    success: false,
                    data: None,
                    error: Some(format!("Failed to parse MOC3 file: {}", e)),
                    model_type: "cubism_v3".to_string(),
                }));
            }
        }
    }
    
    Ok(HttpResponse::Ok().json(ParseResponse {
        success: false,
        data: None,
        error: Some("Unknown file type".to_string()),
        model_type: "unknown".to_string(),
    }))
}

async fn health_check() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "status": "ok",
        "service": "Live2D Parser Service"
    })))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    println!("Starting Live2D Parser Service on http://localhost:8082");
    
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();
            
        App::new()
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .route("/health", web::get().to(health_check))
            .route("/parse-moc", web::post().to(parse_moc_file))
    })
    .bind("127.0.0.1:8082")?
    .run()
    .await
}