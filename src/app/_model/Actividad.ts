import { PacienteScoreJSon } from 'src/app/_model/PacienteScoreJSon';
export class Actividad {
    Id_actividad:number;
    NombreActividad:String;
    Descripcion:String;
    Docente_creador:string;
    Contenido_actividad:String;
    Tipo_actividad:number; 
    Tipo_actividad_texto:String;
    NuevoEstudiante:PacienteScoreJSon;
	EstudiantesHicieronActividad:String;
    Estado_id:number;
}