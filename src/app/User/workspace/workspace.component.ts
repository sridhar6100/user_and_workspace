import { Component,OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/Services/workspace.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit
{
  workspaceDetails:any;
  selectedWorkspace:any;

  apiUrl:any = environment.apiUrl;

  deleteables:string[] = [];

  showFile:boolean = false;
  isImage:boolean = false;

  deleteMode:boolean = false;

  selectedIcon:File | undefined;

  selectedFiles: Array<{ name: string; file:File; dataURL: string; type: string }> = [];

  workspaceForm = new FormGroup({
    title :new FormControl('',Validators.required),
    desc :new FormControl(''),
  });

  constructor(private workspaceService:WorkspaceService,
    private route:ActivatedRoute,
    private modalService: NgbModal,
    private formValidatorService:FormValidatorService,
    private location: Location,
    private authService:AuthServiceService,
    private http:HttpClient){}

  ngOnInit(): void 
  {
    this.authService.ValidateUser().subscribe((res:any)=>{
      this.authService.SetUserId(res.userId); 
      const workspaceId = this.route.snapshot.params["id"];
      if(workspaceId)
      {
        this.GetWorkspace(workspaceId);
      }
    },(error)=>{
    });
  }

  openModal(component:any,size:string="md")
  {
    const modalRef = this.modalService.open(component,{
      size: size,
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });

    this.workspaceForm.reset();
    this.selectedFiles = [];
    this.selectedIcon = undefined;
    this.workspaceForm.patchValue(this.workspaceDetails);
  }

  GetWorkspace(workspaceId:any)
  {
    this.workspaceService.GetWorkspace(workspaceId).subscribe((res:any)=>{
      this.workspaceDetails = res;
      
    },(error)=>{
      console.log(error);
    });
  }

  OnUpdateSubmit()
  {
    if(this.workspaceForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.workspaceForm);
      return;
    }
    const formData = new FormData();
    formData.append("title",this.workspaceForm.value.title??'');
    formData.append("desc",this.workspaceForm.value.desc??'');
    if (this.selectedIcon) {
      formData.append('icon', this.selectedIcon, this.selectedIcon.name);
    }
    for (const file of this.selectedFiles) {
      
      formData.append("attachments",file.file);
    }
    this.workspaceService.UpdateWorkspace(this.workspaceDetails._id,formData).subscribe((res:any)=>{
      console.log(res);
      this.modalService.dismissAll();
      this.GetWorkspace(this.workspaceDetails._id);
    },(error)=>{
      console.log(error);
      
    });
  }

  OnDeleteSubmit()
  {
    if(this.deleteables.length <= 0)
    {
      return;
    }
    const formData = new FormData();
    if (this.deleteables && this.deleteables.length > 0)
    {
      for (const deleteable of this.deleteables) {        
        formData.append("deleteables", deleteable);
      }
    }
    this.workspaceService.UpdateWorkspace(this.workspaceDetails._id,formData).subscribe((res:any)=>{
      console.log(res);
      this.modalService.dismissAll();
      this.GetWorkspace(this.workspaceDetails._id);
      this.deleteables = [];
      this.deleteMode = false;
    },(error)=>{
      console.log(error);
      
    });
  }

  onFileSelected(event: any) {
    this.selectedIcon = event.target.files[0];
  }

  onFileChange(event: any): void {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFiles.push({ name: file.name,file:file, dataURL: e.target.result, type: file.type });
      };

      reader.readAsDataURL(file);
    }
  }  
  
  GetFileType(fileName: string): string
  {
    const lastDotIndex = fileName.lastIndexOf('.');
    const nameWithoutExtension = fileName.slice(0, lastDotIndex);
    const extension = fileName.slice(lastDotIndex + 1);
    return extension;
  }

  getIconName(fileName: string): string {
    const extension = this.GetFileType(fileName);
    switch (extension) {
      case 'png':
        return this.apiUrl+'uploads/'+fileName;
      case 'jpg':
        return this.apiUrl+'uploads/'+fileName;
      case 'jpeg':
        return this.apiUrl+'uploads/'+fileName;
      case 'pdf':
        return 'assets/icons/pdf.png';
      case 'txt':
        return 'assets/icons/txt.png';
      case 'css':
        return 'assets/icons/css.png';
      case 'html':
        return 'assets/icons/html.png';
      case 'js':
        return 'assets/icons/js.png';
      case 'zip':
        return 'assets/icons/zip.png';
      case 'rar':
        return 'assets/icons/rar.png';
      default:
        return 'assets/icons/unknown.png';
    }
  }

  removeFile(index: number): void {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
    }
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }

  GoBack()
  {
    this.location.back();
  }

  plainTextContent: string = '';

  getPlainText(url: string) {
    if(this.GetFileType(url) === 'png' || this.GetFileType(url) === 'jpg' || this.GetFileType(url) === 'jpeg')
    {
      this.isImage=true;
      this.plainTextContent = url;
    }
    else
    {
      this.isImage = false;
      this.http.get(url, { responseType: 'text' }).subscribe((res:any)=>{
        this.plainTextContent = res;
      },(error)=>{
  
      });
    }
  }

  SelectForDelete(fileName:string)
  {
    if(!this.deleteables.includes(fileName)){
      this.deleteables.push(fileName);
    }
    else
    {
      const index = this.deleteables.indexOf(fileName);
      this.deleteables.splice(index,1);
    }
    console.log(this.deleteables);
    
  }

  ToggleShow(state:boolean)
  {
    this.showFile = state;
  }

  ToggleDeleteMode(state:boolean)
  {
    this.deleteMode = state;
    this.deleteables = [];
  }
}
